import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/common/Header";
import Profile from "./components/user/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import AIDreamResultPage from "./pages/AIDreamResultPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DreamDetail from "./pages/DreamDetail";
import DreamList from "./pages/DreamList";
import DreamWritePage from "./pages/DreamWritePage";
import EmotionWritePage from "./pages/EmotionWritePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SignupPage from "./pages/SignupPage";
import SleepRecordPage from "./pages/SleepRecordPage";
import TestPage from "./pages/TestPage";
import EmotionList from "./pages/EmotionList";
import DreamEdit from "./pages/DreamEdit";
import EmotionDetail from "./pages/EmotionDetail";
import EmotionEdit from "./pages/EmotionEdit";
import Support from "./pages/Support";
import Footer from "./components/common/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ScrollToTop from "./components/common/ScrollToTop";
import FavoriteList from "./pages/FavoriteList";
import FindPasswordPage from "./pages/FindPasswordPage";
import { FavoritesProvider } from "./contexts/FavoriteContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <ScrollToTop />
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/signup" element={<SignupPage />}></Route>
            <Route path="/find-password" element={<FindPasswordPage />} />
            <Route path="/support" element={<Support />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/profile/edit" element={<ProfileEditPage />}></Route>

            <Route path="/dreamwrite" element={<DreamWritePage />}></Route>
            <Route path="/dreamlist" element={<DreamList />}></Route>
            <Route path="/dreamdetail/:id" element={<DreamDetail />}></Route>
            <Route path="/dreamedit" element={<DreamEdit />}></Route>

            <Route path="/emotionwrite" element={<EmotionWritePage />}></Route>
            <Route path="/emotionlist" element={<EmotionList />}></Route>
            <Route
              path="/emotiondetail/:id"
              element={<EmotionDetail />}
            ></Route>
            <Route path="/emotionedit" element={<EmotionEdit />}></Route>

            <Route path="/favorites" element={<FavoriteList />}></Route>

            <Route path="/sleeprecord" element={<SleepRecordPage />}></Route>

            <Route path="/privacypolicy" element={<PrivacyPolicy />}></Route>
            <Route path="/termsofservice" element={<TermsOfService />}></Route>
            {/* 테스트페이지입니다-병근 */}
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </FavoritesProvider>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

// Routes 안에 추가
export default App;
