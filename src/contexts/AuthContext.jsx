// src/contexts/AuthContext.jsx 완전판
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../api/supabaseClient";
import { AuthService } from "../services/authService";
import { FileUploadService, UserService } from "../services/userService";
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

const loadProfileCache = () => {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
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
  } catch (e) {
    // console.log("saveProfileCache:", e);
  }
};

const purgeLegacyStorage = () => {
  try {
    localStorage.removeItem("auth_session");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("profile_data");
  } catch (e) {
    // console.log("purgeLegacyStorage:", e);
  }
};

const makeAvatarUrl = (path, updatedAt) => {
  if (!path) return null;
  try {
    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
    const ver = encodeURIComponent(updatedAt || Date.now());
    return `${data.publicUrl}?v=${ver}`;
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = !!session && !!user;
  const isLoggedIn = isAuthenticated;

  // 계정 삭제 상태 체크
  const checkAndHandleDeletedAccount = useCallback(async userId => {
    if (!userId) return false;

    try {
      const { deleted } = await checkAccountDeleted(userId);

      if (deleted) {
        console.log("삭제된 계정 감지");
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
        saveProfileCache(null);
        throw new Error("탈퇴한 유저 이메일입니다.");
      }

      return false;
    } catch (error) {
      throw error;
    }
  }, []);

  const checkDeletedAccountByEmail = useCallback(async email => {
    try {
      const result = await checkEmailAvailability(email);
      return { deleted: result.reason === "deleted" };
    } catch (error) {
      console.error("이메일 삭제 상태 확인 오류:", error);
      return { deleted: false };
    }
  }, []);

  const fetchProfileOnce = useCallback(
    async uid => {
      try {
        await checkAndHandleDeletedAccount(uid);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_user_id", uid)
          .eq("is_deleted", false)
          .is("deleted_at", null)
          .maybeSingle();

        if (error) {
          console.log("fetchProfileOnce error:", error);
          return null;
        }

        if (data) {
          setProfile(data);
          saveProfileCache(data);
          return data;
        }

        return null;
      } catch (e) {
        console.log("fetchProfileOnce exception:", e);
        if (e.message.includes("탈퇴한")) {
          throw e;
        }
        return null;
      }
    },
    [checkAndHandleDeletedAccount],
  );

  useEffect(() => {
    const url = makeAvatarUrl(profile?.profile_image_url, profile?.updated_at);
    setAvatarUrl(url);
  }, [profile?.profile_image_url, profile?.updated_at]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      purgeLegacyStorage();

      try {
        const cached = loadProfileCache();
        if (cached) {
          setProfile(cached);
        }

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const s = data?.session;

        if (s?.user?.id) {
          try {
            await checkAndHandleDeletedAccount(s.user.id);
            setSession(s);
            setUser(s.user);
            fetchProfileOnce(s.user.id);
          } catch (error) {
            console.log("초기화 중 삭제된 계정 감지:", error.message);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          saveProfileCache(null);
        }
      } catch (e) {
        if (!mounted) return;
        console.log("bootstrap exception:", e);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchProfileOnce, checkAndHandleDeletedAccount]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, s) => {
      console.log("onAuthStateChange:", event, !!s, s?.user?.email);

      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
        saveProfileCache(null);
        setLoading(false);
        return;
      }

      if (s?.user?.id) {
        try {
          await checkAndHandleDeletedAccount(s.user.id);
          setSession(s);
          setUser(s.user);
          fetchProfileOnce(s.user.id);
          setLoading(false);
        } catch (error) {
          console.log("Auth 상태 변경 중 삭제된 계정 감지:", error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [fetchProfileOnce, checkAndHandleDeletedAccount]);

  // 로그인
  const signIn = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      try {
        const { deleted } = await checkDeletedAccountByEmail(email);
        if (deleted) {
          return {
            success: false,
            error: "탈퇴한 유저 이메일입니다.",
          };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user?.id) {
          try {
            await checkAndHandleDeletedAccount(data.user.id);
          } catch (checkError) {
            return { success: false, error: checkError.message };
          }
        }

        setSession(data.session);
        setUser(data.user);

        if (data.user?.id) {
          fetchProfileOnce(data.user.id);
        }

        return { success: true, session: data.session, user: data.user };
      } catch (e) {
        logError("signIn", e, { email });
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [
      fetchProfileOnce,
      checkDeletedAccountByEmail,
      checkAndHandleDeletedAccount,
    ],
  );

  // 회원가입
  const signUp = useCallback(async userData => {
    setAuthLoading(true);
    try {
      const emailCheck = await checkEmailAvailability(userData.email);

      if (!emailCheck.available) {
        return {
          success: false,
          error: emailCheck.message,
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          return {
            success: false,
            error: "이미 가입된 이메일입니다.",
          };
        }
        return { success: false, error: error.message };
      }

      const authUser = data.user;
      if (authUser) {
        let profileImageUrl = null;
        if (userData.profileImage) {
          try {
            const upload = await FileUploadService.uploadProfileImage(
              userData.profileImage,
              authUser.id,
            );
            if (upload?.success) profileImageUrl = upload.url;
          } catch (e) {
            logError("profileImageUpload", e, { userId: authUser.id });
          }
        }

        const created = await UserService.createProfile({
          auth_user_id: authUser.id,
          email: userData.email,
          nickname: userData.nickname,
          birthdate: userData.birthdate || null,
          gender: userData.gender || null,
          profile_image_url: profileImageUrl,
        });

        if (!created?.success) {
          return { success: false, error: "프로필 생성에 실패했습니다." };
        }

        if (created.profile) {
          setProfile(created.profile);
          saveProfileCache(created.profile);
        }
      }

      return {
        success: true,
        data,
        message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      };
    } catch (e) {
      logError("signUp", e, { email: userData.email });
      return { success: false, error: String(e?.message || e) };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // 로그아웃
  const signOut = useCallback(async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("supabase.signOut:", error);
      }
      setSession(null);
      setUser(null);
      setProfile(null);
      saveProfileCache(null);
      return { success: true };
    } catch (e) {
      console.log("signOut exception:", e);
      return { success: false, error: String(e?.message || e) };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // 프로필 수정
  const updateProfile = useCallback(
    async profileData => {
      setAuthLoading(true);
      try {
        if (!user?.id) {
          return { success: false, error: "로그인된 사용자가 없습니다." };
        }

        await checkAndHandleDeletedAccount(user.id);

        let profileImageUrl = profileData.profileImageUrl;
        if (profileData.profileImage instanceof File) {
          const upload = await FileUploadService.uploadProfileImage(
            profileData.profileImage,
            user.id,
          );
          if (upload?.success) profileImageUrl = upload.url;
        }

        const updateData = {
          nickname: profileData.nickname,
          birthdate: profileData.birthdate,
          gender: profileData.gender,
          profile_image_url: profileImageUrl,
        };

        const result = await UserService.updateProfile(user.id, updateData);
        if (result?.success) {
          fetchProfileOnce(user.id);
        }
        return result;
      } catch (e) {
        logError("updateProfile", e, { userId: user?.id });
        if (e.message.includes("탈퇴한")) {
          return { success: false, error: e.message };
        }
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [user?.id, fetchProfileOnce, checkAndHandleDeletedAccount],
  );

  // 비밀번호 변경
  const updatePassword = useCallback(
    async newPassword => {
      try {
        if (user?.id) {
          await checkAndHandleDeletedAccount(user.id);
        }

        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (e) {
        if (e.message.includes("탈퇴한")) {
          return { success: false, error: e.message };
        }
        return { success: false, error: String(e?.message || e) };
      }
    },
    [user?.id, checkAndHandleDeletedAccount],
  );

  const resetPassword = useCallback(
    async email => {
      setAuthLoading(true);
      try {
        const { deleted } = await checkDeletedAccountByEmail(email);
        if (deleted) {
          return {
            success: false,
            error: "탈퇴한 유저 이메일입니다.",
          };
        }

        const result = await AuthService.resetPassword(email);
        return result;
      } catch (e) {
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
        fetchProfileOnce(user.id);
      } catch (error) {
        if (error.message.includes("탈퇴한")) {
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
