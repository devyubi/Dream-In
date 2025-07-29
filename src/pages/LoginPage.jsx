import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { useAuthContext } from "../contexts/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 실패: " + error.message);
      return;
    }

    // 로그인 성공!
    setIsLoggedIn(true);
    setUser(data.user); // 또는 data.session.user
    navigate("/"); // ✅ 로그인 성공 후 홈으로 이동!
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginPage;
