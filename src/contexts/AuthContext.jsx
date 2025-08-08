// src/contexts/AuthContext.jsx
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

const AuthContext = createContext({});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// ---- 로컬 캐시 유틸 ----
const PROFILE_CACHE_KEY = "profile_cache"; // 프로필 스냅샷을 저장

const loadProfileCache = () => {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log("loadProfileCache:", e);
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
    console.log("saveProfileCache:", e);
  }
};

// 과거 키 정리(예전 구현 잔여물 제거)
const purgeLegacyStorage = () => {
  try {
    localStorage.removeItem("auth_session");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("profile_data");
  } catch (e) {
    console.log("purgeLegacyStorage:", e);
  }
};

// Public 버킷 가정: 표시용 URL 생성
const makeAvatarUrl = (path, updatedAt) => {
  if (!path) return null;
  try {
    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
    const ver = encodeURIComponent(updatedAt || Date.now());
    return `${data.publicUrl}?v=${ver}`;
  } catch (e) {
    console.log("makeAvatarUrl:", e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 앱 첫 부트 완료 여부 (라우트 게이트 등에서 사용)
  const [loading, setLoading] = useState(true);
  // 버튼/폼 등 작업 로딩
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = !!session && !!user;
  const isLoggedIn = isAuthenticated;

  // 프로필을 DB에서 한 번 가져오기 (백그라운드 호출 가능)
  const fetchProfileOnce = useCallback(async uid => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", uid)
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
      return null;
    }
  }, []);

  // 표시용 아바타 URL 계산 (Public 버킷 기준)
  useEffect(() => {
    const url = makeAvatarUrl(profile?.profile_image_url, profile?.updated_at);
    setAvatarUrl(url);
  }, [profile?.profile_image_url, profile?.updated_at]);

  // ---- 초기 부팅: 캐시 -> 즉시 표시, 세션만 확인하면 loading=false, 프로필은 백그라운드 ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      console.log("=== bootstrap start ===");
      setLoading(true);
      purgeLegacyStorage();

      try {
        // 1) 캐시 먼저 반영 (깜빡임 방지)
        const cached = loadProfileCache();
        if (cached) {
          setProfile(cached);
        }

        // 2) 세션 확인
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const s = data?.session;

        if (s?.user?.id) {
          setSession(s);
          setUser(s.user);
          // 3) 최신 프로필은 백그라운드로 로드 (await 제거)
          fetchProfileOnce(s.user.id);
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
        // ✅ 세션 확인만 끝났으면 무조건 loading=false
        if (mounted) {
          setLoading(false);
          console.log(
            "=== bootstrap done (session checked, loading=false) ===",
          );
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchProfileOnce]);

  // ---- Auth 이벤트: 최소 로직 (로그아웃/로그인 시 캐시 정합성 유지) ----
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
        setSession(s);
        setUser(s.user);
        // 프로필은 백그라운드로
        fetchProfileOnce(s.user.id);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [fetchProfileOnce]);

  // ---- 이메일/비밀번호 로그인 ----
  const signIn = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.log("signIn:", error);
          return { success: false, error: error.message };
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
    [fetchProfileOnce],
  );

  // ---- 회원가입 ----
  const signUp = useCallback(async userData => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (error) {
        console.log("signUp:", error);
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

        // 프로필 생성
        const created = await UserService.createProfile({
          auth_user_id: authUser.id,
          email: userData.email,
          nickname: userData.nickname,
          birthdate: userData.birthdate || null,
          gender: userData.gender || null,
          profile_image_url: profileImageUrl, // 없으면 null
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

  // ---- 로그아웃 ----
  const signOut = useCallback(async () => {
    setAuthLoading(true);
    console.log("=== signOut ===");
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

  // ---- 프로필 수정 ----
  const updateProfile = useCallback(
    async profileData => {
      setAuthLoading(true);
      try {
        if (!user?.id) {
          return { success: false, error: "로그인된 사용자가 없습니다." };
        }

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
          profile_image_url: profileImageUrl, // null 가능
        };

        const result = await UserService.updateProfile(user.id, updateData);
        if (result?.success) {
          // 최신값 재조회 + 캐시 갱신 (백그라운드)
          fetchProfileOnce(user.id);
        }
        return result;
      } catch (e) {
        logError("updateProfile", e, { userId: user?.id });
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [user?.id, fetchProfileOnce],
  );

  // ---- 비밀번호 변경/재설정 ----
  const updatePassword = useCallback(async newPassword => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.log("updatePassword:", error);
        return { success: false, error: error.message };
      }
      console.log("updatePassword ok:", data);
      return { success: true };
    } catch (e) {
      console.log("updatePassword exception:", e);
      return { success: false, error: String(e?.message || e) };
    }
  }, []);

  const resetPassword = useCallback(async email => {
    setAuthLoading(true);
    try {
      const result = await AuthService.resetPassword(email);
      return result;
    } catch (e) {
      logError("resetPassword", e, { email });
      return { success: false, error: String(e?.message || e) };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ---- 디버깅 로그 ----
  useEffect(() => {
    console.log("Auth State:", {
      loading,
      isAuthenticated,
      user: user?.email,
      profileNickname: profile?.nickname,
      hasSession: !!session,
    });
  }, [loading, isAuthenticated, user, profile, session]);

  // 외부에서 수동 새로고침이 필요할 때
  const reloadProfile = useCallback(async () => {
    if (user?.id) {
      fetchProfileOnce(user.id);
    }
  }, [user?.id, fetchProfileOnce]);

  const value = {
    // 상태
    user,
    session,
    profile,
    avatarUrl, // 표시용 URL (Public 버킷 가정)
    loading, // 초기 세션 확인 끝나면 false
    authLoading,
    isAuthenticated,
    isLoggedIn,

    // 메서드
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
