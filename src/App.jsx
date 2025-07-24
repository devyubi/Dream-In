import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>홈</h1>}></Route>
        <Route path="/login" element={<h1>로그인</h1>}></Route>
        <Route path="/signup" element={<h1>회원가입</h1>}></Route>
        <Route path="/profile" element={<h1>프로필</h1>}></Route>
        <Route path="/dreamwrite" element={<h1>꿈 작성</h1>}></Route>
        <Route path="/emotiondiary" element={<h1>감정일기</h1>}></Route>
        <Route path="/sleeprecord" element={<h1>수면기록</h1>}></Route>
        <Route path="/aidreamsresult" element={<h1>꿈 해몽</h1>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
