// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 가져오기
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ getSession 에러:", error);
        } else {
          console.log("📡 getSession 결과:", session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error("❌ getSession 예외:", error);
      } finally {
        setLoading(false); // ✅ 성공/실패 상관없이 로딩 해제
      }
    };

    getSession();

    // 인증 상태 변경 리스너 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔥 상태 변경 감지됨:", event, session);
      setUser(session?.user || null);
      setLoading(false); // ✅ 상태 변경 시마다 로딩 해제
    });

    // 클린업 함수
    return () => {
      subscription?.unsubscribe();
      console.log("🧼 cleanup: 구독 해제됨");
    };
  }, []);

  console.log("📍 현재 상태: ", { user: user?.email, loading });

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
  }
  return context;
};
