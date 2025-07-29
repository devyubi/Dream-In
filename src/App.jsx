import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import WelcomePage from "./pages/WelcomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>홈</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<h1>프로필</h1>} />
        <Route path="/dreamwrite" element={<h1>꿈 작성</h1>} />
        <Route path="/emotiondiary" element={<h1>감정일기</h1>} />
        <Route path="/sleeprecord" element={<h1>수면기록</h1>} />
        <Route path="/aidreamsresult" element={<h1>꿈 해몽</h1>} />

        {/* ✅ 로그인 된 유저만 접근 가능한 라우트 */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
