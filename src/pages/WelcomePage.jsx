// src/pages/WelcomePage.jsx
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const { user, loading } = useAuth();
  console.log("✅ WelcomePage 상태", { user, loading });
  const navigate = useNavigate();

  if (loading) return <p>WelcomePage 로딩 중...</p>;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>{user?.email}님 환영합니다 🎉</h2>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default WelcomePage;
