// src/pages/SignupPage.jsx
import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { data, error } = await signup(email, pw);
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("회원가입 성공!");
      console.log("회원가입 결과:", data);
      navigate("/login");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
        }}
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
          required
        />
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
          required
        />
      </div>

      <button onClick={handleSignup}>회원가입</button>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}

export default SignupPage;
