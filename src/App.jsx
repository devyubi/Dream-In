import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DreamWritePage from "./pages/DreamWritePage";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/profile" element={<h1>프로필</h1>}></Route>
          <Route path="/dreamwrite" element={<DreamWritePage />}></Route>
          <Route path="/emotiondiary" element={<h1>감정일기</h1>}></Route>
          <Route path="/sleeprecord" element={<h1>수면기록</h1>}></Route>
          <Route path="/aidreamsresult" element={<h1>꿈 해몽</h1>}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
