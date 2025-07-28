// src/pages/LoginPage.jsx
import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await login(email, pw);
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("로그인 성공!");
      console.log("로그인된 유저:", data);
      navigate("/welcome"); // ✅ 로그인 성공 시 환영 페이지로 이동
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "300px",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일"
          required
        />
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="비밀번호"
          required
        />
      </div>

      <button onClick={handleLogin}>로그인</button>
      <button onClick={() => navigate("/signup")}>회원가입</button>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}

export default LoginPage;
