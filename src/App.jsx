import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import DreamDetail from "./pages/DreamDetail";
import DreamList from "./pages/DreamList";
import DreamWritePage from "./pages/DreamWritePage";
import EmotionWritePage from "./pages/EmotionWritePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SleepRecordPage from "./pages/SleepRecordPage";
import TestPage from "./pages/TestPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/profile" element={<h1>프로필</h1>}></Route>
          <Route path="/dreamwrite" element={<DreamWritePage />}></Route>
          <Route path="/dreamlist" element={<DreamList />}></Route>
          <Route path="/dreamdetail" element={<DreamDetail />}></Route>
          <Route path="/emotionwrite" element={<EmotionWritePage />}></Route>
          <Route path="/sleeprecord" element={<SleepRecordPage />}></Route>
          <Route path="/aidreamsresult" element={<h1>꿈 해몽</h1>}></Route>
          {/* 테스트페이지입니다-병근 */}
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Routes 안에 추가
export default App;
