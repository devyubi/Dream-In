import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../api/supabaseClient";
import { logError } from "../utils/errorHandler";
import { checkAccountDeleted, checkEmailAvailability } from "../api/auth";

const AuthContext = createContext({});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// ---- 로컬 캐시 유틸 ----
const PROFILE_CACHE_KEY = "profile_cache";
const REDIRECT_GUARD_KEY = "auth_redirect_once";

const redirectOnceToRoot = () => {
  try {
    if (sessionStorage.getItem(REDIRECT_GUARD_KEY) === "1") return;
    sessionStorage.setItem(REDIRECT_GUARD_KEY, "1");
  } catch {}
  window.location.replace("/");
};

const loadProfileCache = () => {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const isValid =
      parsed?.updated_at &&
      Date.now() - new Date(parsed.updated_at).getTime() < 3600000; // 1h
    return isValid ? parsed : null;
  } catch (e) {
    localStorage.removeItem(PROFILE_CACHE_KEY);
    return null;
  }
};

const saveProfileCache = profile => {
  try {
    if (profile) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  } catch {}
};

const makeAvatarUrl = (path, updatedAt) => {
  if (!path) return null;
  try {
    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
    const ver = encodeURIComponent(updatedAt || Date.now());
    return `${data.publicUrl}?v=${ver}`;
  } catch (e) {
    logError("makeAvatarUrl", e);
    return null;
  }
};

// 모든 탭에 “세션 무효화” 알림
const broadcastAuthInvalidated = channelRef => {
  try {
    channelRef.current?.postMessage({
      type: "AUTH_INVALIDATED",
      at: Date.now(),
    });
  } catch {}
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!session && !!user;
  const isLoggedIn = isAuthenticated;

  // BroadcastChannel은 ref로 고정 (의존성 변동 방지)
  const channelRef = useRef(null);
  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      channelRef.current = new BroadcastChannel("auth_channel");
      return () => {
        try {
          channelRef.current?.close();
        } catch {}
        channelRef.current = null;
      };
    }
  }, []);

  const handleAuthInvalidation = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setAvatarUrl(null);
    try {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    } catch {}
    broadcastAuthInvalidated(channelRef);
    redirectOnceToRoot();
  }, []);

  const checkAndHandleDeletedAccount = useCallback(
    async userId => {
      if (!userId) return false;
      try {
        const { deleted } = await checkAccountDeleted(userId);
        if (deleted) {
          await supabase.auth.signOut();
          handleAuthInvalidation();
          throw new Error("탈퇴한 유저 이메일입니다.");
        }
        return false;
      } catch (error) {
        throw error;
      }
    },
    [handleAuthInvalidation],
  );

  const checkDeletedAccountByEmail = useCallback(async email => {
    try {
      const result = await checkEmailAvailability(email);
      return { deleted: result.reason === "deleted" };
    } catch (error) {
      return { deleted: false };
    }
  }, []);

  const fetchProfileOnce = useCallback(
    async (uid, retries = 3) => {
      if (!uid) return null;
      for (let i = 0; i < retries; i++) {
        try {
          await checkAndHandleDeletedAccount(uid);
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_user_id", uid)
            .eq("is_deleted", false)
            .is("deleted_at", null)
            .maybeSingle();

          if (error) throw new Error(error.message);
          if (data) {
            setProfile(data);
            saveProfileCache(data);
            setAvatarUrl(
              makeAvatarUrl(data.profile_image_url, data.updated_at),
            );
            return data;
          }
          return null;
        } catch (e) {
          logError("fetchProfileOnce", e, { uid, attempt: i + 1 });
          if (e.message?.includes("429") && i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }
          if (e.message?.includes("탈퇴한")) throw e;
          return null;
        }
      }
    },
    [checkAndHandleDeletedAccount],
  );

  // 아바타 URL 동기화
  useEffect(() => {
    const url = makeAvatarUrl(profile?.profile_image_url, profile?.updated_at);
    setAvatarUrl(url);
  }, [profile?.profile_image_url, profile?.updated_at]);

  // BroadcastChannel & storage 이벤트 리스너
  useEffect(() => {
    const onAuthChannelMessage = e => {
      const msg = e.data;
      if (!msg || !msg.type) return;
      if (msg.type === "SIGN_OUT") {
        handleAuthInvalidation();
      } else if (msg.type === "AUTH_INVALIDATED") {
        redirectOnceToRoot();
      } else if (msg.type === "SIGN_IN" && msg.userId) {
        fetchProfileOnce(msg.userId);
      }
    };

    const onStorage = e => {
      if (!e) return;
      const isAuthKey =
        e.key === "supabase.auth.token" || (e.key && e.key.includes("auth"));
      const isProfileKey = e.key === PROFILE_CACHE_KEY;

      if ((isAuthKey || isProfileKey) && e.newValue == null) {
        handleAuthInvalidation();
      }
    };

    channelRef.current?.addEventListener("message", onAuthChannelMessage);
    window.addEventListener("storage", onStorage);

    return () => {
      channelRef.current?.removeEventListener("message", onAuthChannelMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, [handleAuthInvalidation, fetchProfileOnce]);

  // 포커스 시 세션 점검
  useEffect(() => {
    const checkSessionOnFocus = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data?.session) {
          handleAuthInvalidation();
          return;
        }
        setSession(data.session);
        setUser(data.session.user);
        await fetchProfileOnce(data.session.user.id);
      } catch (e) {
        logError("checkSessionOnFocus", e);
        handleAuthInvalidation();
      }
    };
    window.addEventListener("focus", checkSessionOnFocus);
    return () => window.removeEventListener("focus", checkSessionOnFocus);
  }, [fetchProfileOnce, handleAuthInvalidation]);

  // 초기화
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      setLoading(true);
      try {
        const cached = loadProfileCache();
        if (cached) setProfile(cached);

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentSession = data?.session;
        if (currentSession?.user?.id) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchProfileOnce(currentSession.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setAvatarUrl(null);
        }
      } catch (e) {
        setError("초기화 중 오류가 발생했습니다.");
        logError("initializeAuth", e);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();
    return () => {
      mounted = false;
    };
  }, [fetchProfileOnce]);

  // onAuthStateChange + 주기 점검
  useEffect(() => {
    if (!initialized) return;

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error(error.message);
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          await fetchProfileOnce(data.session.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setAvatarUrl(null);
        }
      } catch (e) {
        logError("checkSession", e);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        try {
          if (event === "SIGNED_OUT") {
            handleAuthInvalidation();
            return;
          }
          if (event === "SIGNED_IN" && newSession?.user?.id) {
            setSession(newSession);
            setUser(newSession.user);
            await fetchProfileOnce(newSession.user.id);
            channelRef.current?.postMessage({
              type: "SIGN_IN",
              userId: newSession.user.id,
            });
            setLoading(false);
          } else if (event === "TOKEN_REFRESHED" && newSession) {
            setSession(newSession);
            setLoading(false);
          } else {
            setLoading(false);
          }
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
    );

    const interval = setInterval(checkSession, 10000);

    return () => {
      authListener.subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [initialized, fetchProfileOnce, handleAuthInvalidation]);

  // ==== 액션들 ====
  const signIn = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      setError(null);
      try {
        const { deleted } = await checkDeletedAccountByEmail(email);
        if (deleted) {
          setError("탈퇴한 유저 이메일입니다.");
          return { success: false, error: "탈퇴한 유저 이메일입니다." };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }

        await checkAndHandleDeletedAccount(data.user.id);
        channelRef.current?.postMessage({
          type: "SIGN_IN",
          userId: data.user.id,
        });
        return { success: true, session: data.session, user: data.user };
      } catch (e) {
        const errorMessage = e.message?.includes("탈퇴한")
          ? e.message
          : "로그인에 실패했습니다.";
        setError(errorMessage);
        logError("signIn", e, { email });
        return { success: false, error: errorMessage };
      } finally {
        setAuthLoading(false);
      }
    },
    [checkDeletedAccountByEmail, checkAndHandleDeletedAccount],
  );

  const signOut = useCallback(async () => {
    setAuthLoading(true);
    setError(null);
    try {
      for (let i = 0; i < 3; i++) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          if (error.status === 429 && i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }
          throw new Error(error.message);
        }
        break;
      }
      handleAuthInvalidation();
      return { success: true };
    } catch (e) {
      setError("로그아웃에 실패했습니다: " + e.message);
      logError("signOut", e);
      return { success: false, error: "로그아웃에 실패했습니다: " + e.message };
    } finally {
      setAuthLoading(false);
    }
  }, [handleAuthInvalidation]);

  const signUp = useCallback(
    async userData => {
      setAuthLoading(true);
      setError(null);
      try {
        const emailCheck = await checkEmailAvailability(userData.email);
        if (!emailCheck.available) {
          setError(emailCheck.message);
          return { success: false, error: emailCheck.message };
        }

        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
        });

        if (error) {
          setError(error.message);
          return {
            success: false,
            error: error.message?.includes("User already registered")
              ? "이미 가입된 이메일입니다."
              : error.message,
          };
        }

        const authUser = data.user;
        if (authUser) {
          let profileImageUrl = null;
          if (userData.profileImage) {
            try {
              const { data: uploadData, error: uploadError } =
                await supabase.storage
                  .from("profile-images")
                  .upload(
                    `${authUser.id}/${userData.profileImage.name}`,
                    userData.profileImage,
                  );
              if (uploadError) throw new Error(uploadError.message);
              profileImageUrl = uploadData.path;
            } catch (e) {
              logError("profileImageUpload", e, { userId: authUser.id });
            }
          }

          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              auth_user_id: authUser.id,
              email: userData.email,
              nickname: userData.nickname,
              birthdate: userData.birthdate || null,
              gender: userData.gender || null,
              profile_image_url: profileImageUrl,
            });

          if (profileError) {
            setError("프로필 생성에 실패했습니다.");
            return { success: false, error: "프로필 생성에 실패했습니다." };
          }

          await fetchProfileOnce(authUser.id);
          channelRef.current?.postMessage({
            type: "SIGN_IN",
            userId: authUser.id,
          });
        }

        return {
          success: true,
          data,
          message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
        };
      } catch (e) {
        setError("회원가입에 실패했습니다.");
        logError("signUp", e, { email: userData.email });
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [fetchProfileOnce],
  );

  const updateProfile = useCallback(
    async profileData => {
      setAuthLoading(true);
      setError(null);
      try {
        if (!user?.id) {
          setError("로그인된 사용자가 없습니다.");
          return { success: false, error: "로그인된 사용자가 없습니다." };
        }

        await checkAndHandleDeletedAccount(user.id);

        let profileImageUrl = profileData.profileImageUrl;
        if (profileData.profileImage instanceof File) {
          try {
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("profile-images")
                .upload(
                  `${user.id}/${profileData.profileImage.name}`,
                  profileData.profileImage,
                  { upsert: true },
                );
            if (uploadError) throw new Error(uploadError.message);
            profileImageUrl = uploadData.path;
          } catch (e) {
            setError("프로필 사진 업로드에 실패했습니다.");
            logError("profileImageUpload", e, { userId: user.id });
            return {
              success: false,
              error: "프로필 사진 업로드에 실패했습니다.",
            };
          }
        }

        const updateData = {
          nickname: profileData.nickname,
          birthdate: profileData.birthdate,
          gender: profileData.gender,
          profile_image_url: profileImageUrl,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("auth_user_id", user.id);

        if (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }

        await fetchProfileOnce(user.id);
        channelRef.current?.postMessage({ type: "SIGN_IN", userId: user.id });
        return { success: true };
      } catch (e) {
        setError("프로필 업데이트에 실패했습니다.");
        logError("updateProfile", e, { userId: user?.id });
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [user?.id, fetchProfileOnce, checkAndHandleDeletedAccount],
  );

  const updatePassword = useCallback(
    async newPassword => {
      setAuthLoading(true);
      setError(null);
      try {
        if (user?.id) {
          await checkAndHandleDeletedAccount(user.id);
        }
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (e) {
        setError("비밀번호 변경에 실패했습니다.");
        logError("updatePassword", e);
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [user?.id, checkAndHandleDeletedAccount],
  );

  const resetPassword = useCallback(
    async email => {
      setAuthLoading(true);
      setError(null);
      try {
        const { deleted } = await checkDeletedAccountByEmail(email);
        if (deleted) {
          setError("탈퇴한 유저 이메일입니다.");
          return { success: false, error: "탈퇴한 유저 이메일입니다." };
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: "비밀번호 재설정 이메일을 전송했습니다.",
        };
      } catch (e) {
        setError("비밀번호 재설정에 실패했습니다.");
        logError("resetPassword", e, { email });
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [checkDeletedAccountByEmail],
  );

  const reloadProfile = useCallback(async () => {
    if (user?.id) {
      try {
        await fetchProfileOnce(user.id);
        channelRef.current?.postMessage({ type: "SIGN_IN", userId: user.id });
      } catch (error) {
        if (error.message?.includes("탈퇴한")) {
          setError(error.message);
          return;
        }
        throw error;
      }
    }
  }, [user?.id, fetchProfileOnce]);

  const value = {
    user,
    session,
    profile,
    avatarUrl,
    loading,
    authLoading,
    error,
    isAuthenticated,
    isLoggedIn,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    resetPassword,
    reloadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
