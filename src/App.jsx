import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DreamWritePage from "./pages/DreamWritePage";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<h1>로그인</h1>}></Route>
          <Route path="/signup" element={<h1>회원가입</h1>}></Route>
          <Route path="/profile" element={<h1>프로필</h1>}></Route>
        <Route
          path="/dreamwrite"
          element={<DreamWritePage></DreamWritePage>}
        ></Route>
          <Route path="/emotiondiary" element={<h1>감정일기</h1>}></Route>
          <Route path="/sleeprecord" element={<h1>수면기록</h1>}></Route>
          <Route path="/aidreamsresult" element={<h1>꿈 해몽</h1>}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
