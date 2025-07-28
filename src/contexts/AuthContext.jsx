// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("📡 getSession 결과:", session);
      setUser(session?.user || null);
      setLoading(false); // ✅ 초기 로딩 해제
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔥 상태 변경 감지됨:", event, session);
        setUser(session?.user || null);
        setLoading(false); // ✅ 여기 꼭 있어야 함!!!
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
      console.log("🧼 cleanup: 구독 해제됨");
    };
  }, []);

  console.log("📍 현재 상태: ", { user, loading });

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
    console.warn("❗ useAuth는 AuthProvider 안에서만 사용해야 합니다.");
    return { user: null, loading: true };
  }
  return context;
};
