import React, {
  createContext,
  useContext,
  useState,
  useEffect, // 추가
} from "react";
import { supabase } from "../api/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 로그인
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 유저
  const [user, setUser] = useState(null);
  // 다크모드
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 로그인
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        // session.user는 name이 아니라 email, id 같은 걸 포함함다
        setUser(session.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
