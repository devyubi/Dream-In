// src/contexts/AuthContext.jsx - 수정된 버전
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
    console.warn("프로필 캐시 로드 실패:", e);
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
    console.warn("프로필 캐시 저장 실패:", e);
  }
};

const purgeLegacyStorage = () => {
  try {
    localStorage.removeItem("auth_session");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("profile_data");
  } catch (e) {
    console.warn("레거시 스토리지 정리 실패:", e);
  }
};

const makeAvatarUrl = (path, updatedAt) => {
  if (!path) return null;
  try {
    const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
    const ver = encodeURIComponent(updatedAt || Date.now());
    return `${data.publicUrl}?v=${ver}`;
  } catch (e) {
    console.warn("아바타 URL 생성 실패:", e);
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
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = !!session && !!user;
  const isLoggedIn = isAuthenticated;

  // 계정 삭제 상태 체크 (안전성 개선)
  const checkAndHandleDeletedAccount = useCallback(async userId => {
    if (!userId) return false;

    try {
      const { deleted } = await checkAccountDeleted(userId);

      if (deleted) {
        console.log("삭제된 계정 감지:", userId);
        // 세션 정리
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
        saveProfileCache(null);
        throw new Error("탈퇴한 유저 이메일입니다.");
      }

      return false;
    } catch (error) {
      console.error("계정 삭제 상태 확인 오류:", error);
      throw error;
    }
  }, []);

  // 이메일로 삭제된 계정 체크 (개선된 버전)
  const checkDeletedAccountByEmail = useCallback(async email => {
    try {
      const result = await checkEmailAvailability(email);
      return { deleted: result.reason === "deleted" };
    } catch (error) {
      console.error("이메일 삭제 상태 확인 오류:", error);
      // 에러 발생 시 삭제되지 않은 것으로 간주하여 로그인 시도 허용
      return { deleted: false };
    }
  }, []);

  // 프로필 가져오기 (에러 처리 개선)
  const fetchProfileOnce = useCallback(
    async uid => {
      if (!uid) return null;

      try {
        // 삭제된 계정 체크는 세션이 확정된 후에만 실행
        if (session) {
          await checkAndHandleDeletedAccount(uid);
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_user_id", uid)
          .eq("is_deleted", false)
          .is("deleted_at", null)
          .maybeSingle();

        if (error) {
          console.error("프로필 조회 오류:", error);
          return null;
        }

        if (data) {
          setProfile(data);
          saveProfileCache(data);
          return data;
        }

        return null;
      } catch (e) {
        console.error("프로필 가져오기 실패:", e);
        if (e.message.includes("탈퇴한")) {
          throw e;
        }
        return null;
      }
    },
    [session, checkAndHandleDeletedAccount],
  );

  // 아바타 URL 업데이트
  useEffect(() => {
    const url = makeAvatarUrl(profile?.profile_image_url, profile?.updated_at);
    setAvatarUrl(url);
  }, [profile?.profile_image_url, profile?.updated_at]);

  // 초기 세션 로드
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("🔄 Auth 초기화 시작");
      setLoading(true);
      purgeLegacyStorage();

      try {
        // 캐시된 프로필 로드
        const cached = loadProfileCache();
        if (cached) {
          setProfile(cached);
        }

        // 현재 세션 확인
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentSession = data?.session;
        console.log(
          "📋 현재 세션:",
          !!currentSession,
          currentSession?.user?.email,
        );

        if (currentSession?.user?.id) {
          try {
            setSession(currentSession);
            setUser(currentSession.user);

            // 프로필은 세션 설정 후에 가져오기
            await fetchProfileOnce(currentSession.user.id);
            console.log("✅ Auth 초기화 완료 (로그인됨)");
          } catch (error) {
            console.log("❌ 초기화 중 삭제된 계정 감지:", error.message);
            // 삭제된 계정인 경우 상태 초기화
            setSession(null);
            setUser(null);
            setProfile(null);
            saveProfileCache(null);
          }
        } else {
          console.log("📭 세션 없음");
          setSession(null);
          setUser(null);
          setProfile(null);
          saveProfileCache(null);
        }
      } catch (e) {
        if (mounted) {
          console.error("Auth 초기화 오류:", e);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
          console.log("🏁 Auth 초기화 종료");
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []); // fetchProfileOnce 의존성 제거하여 무한 루프 방지

  // Auth 상태 변화 감지
  useEffect(() => {
    if (!initialized) return;

    const { data } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(
          "🔔 Auth 상태 변화:",
          event,
          !!newSession,
          newSession?.user?.email,
        );

        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setProfile(null);
          saveProfileCache(null);
          setLoading(false);
          return;
        }

        if (event === "SIGNED_IN" && newSession?.user?.id) {
          try {
            setSession(newSession);
            setUser(newSession.user);

            // 새 세션에서 프로필 가져오기
            await fetchProfileOnce(newSession.user.id);
            setLoading(false);
          } catch (error) {
            console.log("Auth 상태 변경 중 삭제된 계정 감지:", error.message);
            setLoading(false);
          }
        } else if (event === "TOKEN_REFRESHED" && newSession) {
          setSession(newSession);
          setLoading(false);
        } else {
          setLoading(false);
        }
      },
    );

    return () => data.subscription.unsubscribe();
  }, [initialized, fetchProfileOnce]);

  // 로그인 (개선된 버전)
  const signIn = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      console.log("🔐 로그인 시도:", email);

      try {
        // 1. 이메일 삭제 상태 확인 (선택적)
        try {
          const { deleted } = await checkDeletedAccountByEmail(email);
          if (deleted) {
            return {
              success: false,
              error: "탈퇴한 유저 이메일입니다.",
            };
          }
        } catch (emailCheckError) {
          console.warn(
            "이메일 사전 확인 실패, 로그인 계속 진행:",
            emailCheckError,
          );
          // 이메일 확인 실패해도 로그인 시도는 계속
        }

        // 2. 실제 로그인 시도
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("로그인 오류:", error);
          return { success: false, error: error.message };
        }

        console.log("✅ 로그인 성공:", data.user?.email);

        // 3. 로그인 성공 후 삭제된 계정 최종 확인
        if (data.user?.id) {
          try {
            await checkAndHandleDeletedAccount(data.user.id);
          } catch (checkError) {
            console.log("로그인 후 삭제된 계정 확인:", checkError.message);
            return { success: false, error: checkError.message };
          }
        }

        // 4. 상태 업데이트는 onAuthStateChange에서 자동 처리됨
        return { success: true, session: data.session, user: data.user };
      } catch (e) {
        console.error("로그인 예외:", e);
        logError("signIn", e, { email });
        return { success: false, error: String(e?.message || e) };
      } finally {
        setAuthLoading(false);
      }
    },
    [checkDeletedAccountByEmail, checkAndHandleDeletedAccount],
  );

  // 회원가입
  const signUp = useCallback(async userData => {
    setAuthLoading(true);
    console.log("📝 회원가입 시도:", userData.email);

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

      console.log("✅ 회원가입 성공");
      return {
        success: true,
        data,
        message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      };
    } catch (e) {
      console.error("회원가입 예외:", e);
      logError("signUp", e, { email: userData.email });
      return { success: false, error: String(e?.message || e) };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // 로그아웃
  const signOut = useCallback(async () => {
    setAuthLoading(true);
    console.log("🚪 로그아웃 시도");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("로그아웃 오류:", error);
      }

      // 상태 초기화
      setSession(null);
      setUser(null);
      setProfile(null);
      saveProfileCache(null);

      console.log("✅ 로그아웃 완료");
      return { success: true };
    } catch (e) {
      console.error("로그아웃 예외:", e);
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

  // 비밀번호 재설정
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

  // 프로필 다시 로드
  const reloadProfile = useCallback(async () => {
    if (user?.id) {
      try {
        await fetchProfileOnce(user.id);
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
