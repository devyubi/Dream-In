import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import ScrollToTop from "./components/common/ScrollToTop";
import Profile from "./components/user/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoriteContext";
import "./index.css";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DreamDetail from "./pages/DreamDetail";
import DreamEdit from "./pages/DreamEdit";
import DreamList from "./pages/DreamList";
import DreamWritePage from "./pages/DreamWritePage";
import EmotionDetail from "./pages/EmotionDetail";
import EmotionEdit from "./pages/EmotionEdit";
import EmotionList from "./pages/EmotionList";
import EmotionWritePage from "./pages/EmotionWritePage";
import FavoriteList from "./pages/FavoriteList";
import FindPasswordPage from "./pages/FindPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProfileEditPage from "./pages/ProfileEditPage";
import SignupPage from "./pages/SignupPage";
import SleepRecordPage from "./pages/SleepRecordPage";
import Support from "./pages/Support";
import TermsOfService from "./pages/TermsOfService";
import FindEmailPage from "./pages/FindEmailPage";

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
            <Route path="/find-email" element={<FindEmailPage />} />

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
          </Routes>
        </FavoritesProvider>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

// Routes 안에 추가
export default App;
