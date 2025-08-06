// src/pages/TestPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCurrentUserProfile } from "../api/auth"; // 이 함수가 문제일 수 있음
import { supabase } from "../api/supabaseClient";

const TestPage = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isTestRunning, setIsTestRunning] = useState(false);

  // 디버깅용 로그
  console.log("=== TestPage 렌더링 ===");
  console.log("authContext:", useAuth());
  console.log("loading 값:", useAuth()?.loading);
  console.log("user 값:", useAuth()?.user);

  // 1. AuthContext에서 가져온 현재 상태 표시
  const renderAuthStatus = () => (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        marginBottom: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>🔍 AuthContext 현재 상태</h3>
      <p>
        <strong>Loading:</strong> {loading ? "YES" : "NO"}
      </p>
      <p>
        <strong>User:</strong> {user ? `${user.email} (${user.id})` : "null"}
      </p>
      <p>
        <strong>Profile:</strong> {profile ? `${profile.nickname}` : "null"}
      </p>
      <p>
        <strong>Profile Object:</strong>
      </p>
      <pre
        style={{
          fontSize: "12px",
          backgroundColor: "#fff",
          padding: "10px",
          overflow: "auto",
        }}
      >
        {profile ? JSON.stringify(profile, null, 2) : "null"}
      </pre>
    </div>
  );

  // 2. 직접 Supabase에서 프로필 조회 테스트
  const testDirectSupabaseQuery = async () => {
    console.log("=== 직접 Supabase 조회 테스트 ===");

    try {
      // 현재 세션 확인
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        return { success: false, error: "세션 없음" };
      }

      console.log("현재 사용자 ID:", session.user.id);

      // 프로필 직접 조회
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", session.user.id);

      console.log("직접 조회 결과:", profiles);
      console.log("직접 조회 에러:", profileError);

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      return {
        success: true,
        data: profiles?.[0] || null,
        count: profiles?.length || 0,
      };
    } catch (error) {
      console.error("직접 조회 예외:", error);
      return { success: false, error: error.message };
    }
  };

  // 3. getCurrentUserProfile API 함수 테스트
  const testGetCurrentUserProfileAPI = async () => {
    console.log("=== getCurrentUserProfile API 테스트 ===");

    try {
      const result = await getCurrentUserProfile();
      console.log("API 함수 결과:", result);

      return {
        success: !!result,
        data: result,
        error: result ? null : "API 함수가 null 반환",
      };
    } catch (error) {
      console.error("API 함수 예외:", error);
      return { success: false, error: error.message };
    }
  };

  // 4. 모든 테스트 실행
  const runAllTests = async () => {
    setIsTestRunning(true);
    console.log("=== 모든 테스트 시작 ===");

    const results = {};

    // 테스트 1: 직접 Supabase 조회
    results.directSupabase = await testDirectSupabaseQuery();

    // 테스트 2: getCurrentUserProfile API
    results.apiFunction = await testGetCurrentUserProfileAPI();

    // 테스트 3: AuthContext refreshProfile
    try {
      await refreshProfile();
      results.refreshProfile = {
        success: true,
        message: "refreshProfile 실행 완료",
      };
    } catch (error) {
      results.refreshProfile = { success: false, error: error.message };
    }

    setTestResults(results);
    setIsTestRunning(false);

    console.log("=== 모든 테스트 완료 ===");
    console.log("테스트 결과:", results);
  };

  // 페이지 로드 시 자동으로 테스트 실행
  useEffect(() => {
    if (!loading && user) {
      runAllTests();
    }
  }, [loading, user]);

  // 5. 테스트 결과 렌더링
  const renderTestResults = () => {
    if (Object.keys(testResults).length === 0) return null;

    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff3e0",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>🧪 테스트 결과</h3>

        {/* 직접 Supabase 조회 결과 */}
        <div style={{ marginBottom: "15px" }}>
          <h4>1. 직접 Supabase 조회:</h4>
          <div
            style={{
              padding: "10px",
              backgroundColor: testResults.directSupabase?.success
                ? "#e8f5e8"
                : "#ffebee",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {testResults.directSupabase?.success ? (
              <div>
                <p>✅ 성공</p>
                <p>프로필 개수: {testResults.directSupabase.count}</p>
                <p>
                  닉네임: {testResults.directSupabase.data?.nickname || "null"}
                </p>
              </div>
            ) : (
              <div>
                <p>❌ 실패</p>
                <p>에러: {testResults.directSupabase?.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* API 함수 결과 */}
        <div style={{ marginBottom: "15px" }}>
          <h4>2. getCurrentUserProfile API:</h4>
          <div
            style={{
              padding: "10px",
              backgroundColor: testResults.apiFunction?.success
                ? "#e8f5e8"
                : "#ffebee",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {testResults.apiFunction?.success ? (
              <div>
                <p>✅ 성공</p>
                <p>
                  닉네임: {testResults.apiFunction.data?.nickname || "null"}
                </p>
              </div>
            ) : (
              <div>
                <p>❌ 실패</p>
                <p>에러: {testResults.apiFunction?.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* RefreshProfile 결과 */}
        <div>
          <h4>3. RefreshProfile:</h4>
          <div
            style={{
              padding: "10px",
              backgroundColor: testResults.refreshProfile?.success
                ? "#e8f5e8"
                : "#ffebee",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {testResults.refreshProfile?.success ? (
              <p>✅ {testResults.refreshProfile.message}</p>
            ) : (
              <div>
                <p>❌ 실패</p>
                <p>에러: {testResults.refreshProfile?.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>로딩 중...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>로그인이 필요합니다</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>🔧 AuthContext 문제 진단 페이지</h1>

      {/* 현재 AuthContext 상태 */}
      {renderAuthStatus()}

      {/* 테스트 결과 */}
      {renderTestResults()}

      {/* 수동 테스트 버튼들 */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
        }}
      >
        <h3>🎮 수동 테스트</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={runAllTests}
            disabled={isTestRunning}
            style={{ padding: "10px 20px", fontSize: "14px" }}
          >
            {isTestRunning ? "테스트 실행 중..." : "모든 테스트 다시 실행"}
          </button>

          <button
            onClick={refreshProfile}
            style={{ padding: "10px 20px", fontSize: "14px" }}
          >
            RefreshProfile 실행
          </button>

          <button
            onClick={() => {
              console.log("현재 AuthContext 상태:");
              console.log("user:", user);
              console.log("profile:", profile);
              console.log("loading:", loading);
            }}
            style={{ padding: "10px 20px", fontSize: "14px" }}
          >
            콘솔에 상태 출력
          </button>
        </div>
      </div>

      {/* 진단 결과 요약 */}
      {Object.keys(testResults).length > 0 && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f3e5f5",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h3>🎯 진단 결과 요약</h3>
          {testResults.directSupabase?.success &&
            !testResults.apiFunction?.success && (
              <div style={{ color: "#d32f2f" }}>
                <p>
                  <strong>문제 발견:</strong> Supabase 직접 조회는 성공하지만
                  getCurrentUserProfile API 함수가 실패합니다.
                </p>
                <p>
                  <strong>해결방법:</strong> src/api/auth.js의
                  getCurrentUserProfile 함수를 확인해야 합니다.
                </p>
              </div>
            )}

          {!testResults.directSupabase?.success && (
            <div style={{ color: "#d32f2f" }}>
              <p>
                <strong>문제 발견:</strong> Supabase 직접 조회도 실패합니다.
              </p>
              <p>
                <strong>해결방법:</strong> 데이터베이스 연결이나 권한 문제일
                가능성이 높습니다.
              </p>
            </div>
          )}

          {testResults.directSupabase?.success &&
            testResults.apiFunction?.success &&
            !profile && (
              <div style={{ color: "#d32f2f" }}>
                <p>
                  <strong>문제 발견:</strong> API는 정상이지만 AuthContext의
                  상태 업데이트가 안 됩니다.
                </p>
                <p>
                  <strong>해결방법:</strong> AuthContext의 loadUserProfile
                  함수를 확인해야 합니다.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TestPage;
