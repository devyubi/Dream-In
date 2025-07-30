// src/pages/TestPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const {
    user,
    profile,
    signOut,
    forceSignOut,
    loading, // ✅ 추가된 loading 변수
    authLoading,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();
  const [sessionInfo, setSessionInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 실시간 세션 모니터링
  useEffect(() => {
    const updateSessionInfo = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        setSessionInfo({ session, error });
        setLastUpdated(new Date());
      } catch (err) {
        console.error("세션 정보 업데이트 실패:", err);
      }
    };

    // 초기 로드
    updateSessionInfo();

    // 5초마다 세션 상태 확인
    const interval = setInterval(updateSessionInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  // 페이지 로드 시 맨 위로 스크롤 & body 스타일 설정
  useEffect(() => {
    window.scrollTo(0, 0);

    // body와 html의 스크롤 설정
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";

    // 컴포넌트 언마운트 시 원복
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };
  }, []);

  const handleLogout = async () => {
    console.log("로그아웃 시작...");

    const result = await signOut();

    if (result.success) {
      console.log("✅ 로그아웃 성공!");
      alert("로그아웃되었습니다.");
      navigate("/login", { replace: true });
    } else {
      console.error("❌ 로그아웃 실패:", result.error);
      alert("로그아웃 실패: " + result.error);
    }
  };

  const handleForceLogout = async () => {
    console.log("🔥 강제 로그아웃 실행...");
    await forceSignOut();
  };

  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      auth_user: {
        id: user?.id,
        email: user?.email,
        email_confirmed_at: user?.email_confirmed_at,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
        last_sign_in_at: user?.last_sign_in_at,
        app_metadata: user?.app_metadata,
        user_metadata: user?.user_metadata,
      },
      profile: profile,
      auth_state: {
        isAuthenticated,
        loading,
        authLoading,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `dream-in-user-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("📁 사용자 데이터 내보내기 완료");
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollWrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>🧪 테스트 페이지</h1>

          {/* 인증 상태 표시 */}
          <div style={styles.section}>
            <h2>📊 현재 상태 (실시간)</h2>
            <div style={styles.realTimeInfo}>
              <p>
                <strong>마지막 업데이트:</strong>{" "}
                {lastUpdated.toLocaleTimeString("ko-KR")}
              </p>
            </div>
            <div style={styles.statusGrid}>
              <div style={styles.statusItem}>
                <strong>로그인 상태:</strong>
                <span style={isAuthenticated ? styles.success : styles.error}>
                  {isAuthenticated ? "✅ 로그인됨" : "❌ 로그아웃됨"}
                </span>
              </div>

              <div style={styles.statusItem}>
                <strong>로딩 상태:</strong>
                <span>{authLoading ? "⏳ 처리 중..." : "✅ 완료"}</span>
              </div>

              <div style={styles.statusItem}>
                <strong>Supabase 세션:</strong>
                <span
                  style={
                    sessionInfo?.session?.user ? styles.success : styles.error
                  }
                >
                  {sessionInfo?.session?.user ? "✅ 활성" : "❌ 비활성"}
                </span>
              </div>

              <div style={styles.statusItem}>
                <strong>세션 만료:</strong>
                <span>
                  {sessionInfo?.session?.expires_at
                    ? new Date(
                        sessionInfo.session.expires_at * 1000,
                      ).toLocaleString("ko-KR")
                    : "N/A"}
                </span>
              </div>

              <div style={styles.statusItem}>
                <strong>액세스 토큰:</strong>
                <span
                  style={
                    sessionInfo?.session?.access_token
                      ? styles.success
                      : styles.error
                  }
                >
                  {sessionInfo?.session?.access_token
                    ? `✅ ${sessionInfo.session.access_token.slice(0, 20)}...`
                    : "❌ 없음"}
                </span>
              </div>

              <div style={styles.statusItem}>
                <strong>리프레시 토큰:</strong>
                <span
                  style={
                    sessionInfo?.session?.refresh_token
                      ? styles.success
                      : styles.error
                  }
                >
                  {sessionInfo?.session?.refresh_token
                    ? `✅ ${sessionInfo.session.refresh_token.slice(0, 20)}...`
                    : "❌ 없음"}
                </span>
              </div>
            </div>
          </div>

          {/* 사용자 정보 */}
          {isAuthenticated && (
            <div style={styles.section}>
              <h2>👤 회원가입 정보 전체보기</h2>

              {/* 기본 인증 정보 */}
              <div style={styles.infoSection}>
                <h3>🔐 인증 정보 (auth.users)</h3>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <strong>사용자 ID:</strong>
                    <span>{user?.id || "N/A"}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <strong>이메일:</strong>
                    <span>{user?.email || "N/A"}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <strong>이메일 인증:</strong>
                    <span
                      style={
                        user?.email_confirmed_at ? styles.success : styles.error
                      }
                    >
                      {user?.email_confirmed_at ? "✅ 인증완료" : "❌ 미인증"}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <strong>계정 생성일:</strong>
                    <span>
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleString("ko-KR")
                        : "N/A"}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <strong>마지막 로그인:</strong>
                    <span>
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString("ko-KR")
                        : "N/A"}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <strong>인증 제공자:</strong>
                    <span>{user?.app_metadata?.provider || "email"}</span>
                  </div>
                </div>
              </div>

              {/* 프로필 정보 */}
              <div style={styles.infoSection}>
                <h3>📝 프로필 정보 (public.users)</h3>
                {profile ? (
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <strong>프로필 ID:</strong>
                      <span>{profile.id?.slice(0, 8)}...</span>
                    </div>
                    <div style={styles.infoItem}>
                      <strong>닉네임:</strong>
                      <span>{profile.nickname || "N/A"}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <strong>생년월일:</strong>
                      <span>
                        {profile.birthdate
                          ? new Date(profile.birthdate).toLocaleDateString(
                              "ko-KR",
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <strong>성별:</strong>
                      <span>
                        {profile.gender === "male"
                          ? "👨 남성"
                          : profile.gender === "female"
                            ? "👩 여성"
                            : profile.gender === "other"
                              ? "🧑 기타"
                              : "N/A"}
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <strong>프로필 생성일:</strong>
                      <span>
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleString("ko-KR")
                          : "N/A"}
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <strong>마지막 수정일:</strong>
                      <span>
                        {profile.updated_at
                          ? new Date(profile.updated_at).toLocaleString("ko-KR")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p style={styles.noData}>프로필 정보가 없습니다.</p>
                )}
              </div>

              {/* 프로필 이미지 */}
              {profile?.profile_image_url && (
                <div style={styles.infoSection}>
                  <h3>📸 프로필 이미지</h3>
                  <div style={styles.profileImageContainer}>
                    <img
                      src={profile.profile_image_url}
                      alt="프로필 이미지"
                      style={styles.profileImage}
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div style={{ ...styles.imageError, display: "none" }}>
                      ❌ 이미지 로드 실패
                    </div>
                    <div style={styles.imageInfo}>
                      <p>
                        <strong>이미지 URL:</strong>
                      </p>
                      <p style={styles.urlText}>{profile.profile_image_url}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 나이 계산 */}
              {profile?.birthdate && (
                <div style={styles.infoSection}>
                  <h3>📊 계산된 정보</h3>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <strong>나이:</strong>
                      <span>
                        {new Date().getFullYear() -
                          new Date(profile.birthdate).getFullYear()}
                        세
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <strong>가입 경과일:</strong>
                      <span>
                        {Math.floor(
                          (new Date() - new Date(profile.created_at)) /
                            (1000 * 60 * 60 * 24),
                        )}
                        일
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 로그아웃 버튼들 */}
          {isAuthenticated ? (
            <div style={styles.section}>
              <h2>🚪 로그아웃 테스트</h2>
              <div style={styles.buttonGroup}>
                <button
                  onClick={handleLogout}
                  disabled={authLoading}
                  style={{ ...styles.button, ...styles.logoutButton }}
                >
                  {authLoading ? "⏳ 로그아웃 중..." : "🚪 확인 후 로그아웃"}
                </button>

                <button
                  onClick={handleForceLogout}
                  disabled={authLoading}
                  style={{ ...styles.button, ...styles.quickLogoutButton }}
                >
                  🔥 강제 로그아웃
                </button>

                <button
                  onClick={async () => {
                    console.log("🔧 Supabase 직접 로그아웃...");
                    try {
                      const { error } = await supabase.auth.signOut();
                      if (error) {
                        console.error("직접 로그아웃 실패:", error);
                      } else {
                        console.log("✅ Supabase 직접 로그아웃 성공");
                        window.location.reload();
                      }
                    } catch (err) {
                      console.error("직접 로그아웃 오류:", err);
                    }
                  }}
                  disabled={authLoading}
                  style={{ ...styles.button, ...styles.debugButton }}
                >
                  🔧 Supabase 직접 로그아웃
                </button>

                <button
                  onClick={handleExportData}
                  style={{ ...styles.button, ...styles.navButton }}
                >
                  📁 데이터 내보내기 (JSON)
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.section}>
              <h2>🔐 로그인 필요</h2>
              <p>로그아웃 상태입니다. 로그인해주세요.</p>
              <button
                onClick={() => navigate("/login")}
                style={{ ...styles.button, ...styles.loginButton }}
              >
                🔑 로그인 페이지로
              </button>
            </div>
          )}

          {/* 개발자 도구 */}
          <div style={styles.section}>
            <h2>🛠️ 개발자 도구</h2>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => console.log("=== USER (auth.users) ===", user)}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                🔍 User 객체 출력
              </button>

              <button
                onClick={() =>
                  console.log("=== PROFILE (public.users) ===", profile)
                }
                style={{ ...styles.button, ...styles.debugButton }}
              >
                🔍 Profile 객체 출력
              </button>

              <button
                onClick={async () => {
                  console.log("=== SUPABASE 세션 정보 ===");
                  const {
                    data: { session },
                    error,
                  } = await supabase.auth.getSession();
                  console.log("Session:", session);
                  console.log("Error:", error);
                  console.log("User from session:", session?.user);
                }}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                🔍 Supabase 세션 출력
              </button>

              <button
                onClick={async () => {
                  console.log("=== DATABASE 직접 조회 ===");
                  try {
                    if (!user?.id) {
                      console.error("❌ 사용자 ID가 없습니다:", user);
                      return;
                    }

                    console.log("🔍 조회할 auth_user_id:", user.id);

                    const { data, error } = await supabase
                      .from("users")
                      .select("*")
                      .eq("auth_user_id", user.id);

                    console.log("✅ DB 조회 결과:", data);
                    console.log("❌ DB 조회 에러:", error);

                    if (data && data.length === 0) {
                      console.warn(
                        "⚠️ users 테이블에 해당 사용자 데이터가 없습니다!",
                      );
                    }
                  } catch (err) {
                    console.error("❌ DB 조회 실패:", err);
                  }
                }}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                🔍 DB 직접 조회
              </button>

              <button
                onClick={async () => {
                  console.log("=== RLS 정책 테스트 ===");
                  try {
                    // 1. 현재 사용자 확인
                    const {
                      data: { user: currentUser },
                    } = await supabase.auth.getUser();
                    console.log("현재 인증된 사용자:", currentUser?.id);

                    // 2. auth.uid() 확인
                    const { data: uidData, error: uidError } =
                      await supabase.rpc("auth_uid");
                    console.log("auth.uid() 결과:", uidData);
                    console.log("auth.uid() 에러:", uidError);

                    // 3. RLS 없이 조회 시도 (에러 확인용)
                    const { data: allUsers, error: allError } = await supabase
                      .from("users")
                      .select("auth_user_id, nickname")
                      .limit(5);
                    console.log("전체 users 조회 (RLS 적용):", allUsers);
                    console.log("전체 users 에러:", allError);
                  } catch (err) {
                    console.error("❌ RLS 테스트 실패:", err);
                  }
                }}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                🔒 RLS 정책 테스트
              </button>

              <button
                onClick={async () => {
                  console.log("=== 프로필 강제 재로드 ===");
                  try {
                    const { getCurrentUserProfile } = await import(
                      "../api/auth"
                    );
                    const profileData = await getCurrentUserProfile();
                    console.log("강제 재로드 결과:", profileData);

                    if (!profileData) {
                      console.warn(
                        "⚠️ getCurrentUserProfile이 null을 반환했습니다",
                      );
                    }
                  } catch (err) {
                    console.error("❌ 프로필 재로드 실패:", err);
                  }
                }}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                🔄 프로필 강제 재로드
              </button>

              <button
                onClick={() => {
                  console.log("=== 전체 인증 상태 ===");
                  console.log("User:", user);
                  console.log("Profile:", profile);
                  console.log("isAuthenticated:", isAuthenticated);
                  console.log("loading:", loading);
                  console.log("authLoading:", authLoading);
                  console.log("sessionInfo:", sessionInfo);
                  console.log("localStorage keys:", Object.keys(localStorage));
                  console.log(
                    "sessionStorage keys:",
                    Object.keys(sessionStorage),
                  );
                }}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                📋 전체 상태 출력
              </button>

              <button
                onClick={async () => {
                  console.log("=== 프로필 이미지 테스트 ===");
                  if (profile?.profile_image_url) {
                    try {
                      const response = await fetch(profile.profile_image_url);
                      console.log(
                        "이미지 URL 상태:",
                        response.status,
                        response.statusText,
                      );
                      console.log(
                        "이미지 헤더:",
                        Object.fromEntries(response.headers),
                      );
                    } catch (err) {
                      console.error("이미지 URL 테스트 실패:", err);
                    }
                  } else {
                    console.log("프로필 이미지 없음");
                  }
                }}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                📸 이미지 URL 테스트
              </button>

              <button
                onClick={async () => {
                  console.log("=== 수동 프로필 생성 테스트 ===");
                  try {
                    if (!user?.id) {
                      console.error("❌ 로그인된 사용자가 없습니다");
                      return;
                    }

                    const { data, error } = await supabase
                      .from("users")
                      .insert({
                        auth_user_id: user.id,
                        email: user.email,
                        nickname: "테스트사용자",
                        birthdate: null,
                        gender: null,
                        profile_image_url: null,
                      })
                      .select()
                      .single();

                    if (error) {
                      console.error("❌ 프로필 생성 실패:", error);
                    } else {
                      console.log("✅ 프로필 생성 성공:", data);
                      alert(
                        "프로필이 생성되었습니다! 페이지를 새로고침하세요.",
                      );
                    }
                  } catch (err) {
                    console.error("❌ 프로필 생성 오류:", err);
                  }
                }}
                style={{ ...styles.button, ...styles.quickLogoutButton }}
              >
                👤 수동 프로필 생성
              </button>
            </div>
          </div>

          {/* 네비게이션 */}
          <div style={{ ...styles.section, marginBottom: "60px" }}>
            {" "}
            {/* 마지막 섹션에 더 큰 마진 */}
            <h2>🧭 페이지 이동</h2>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => navigate("/login")}
                style={{ ...styles.button, ...styles.navButton }}
              >
                📝 로그인 페이지
              </button>

              <button
                onClick={() => navigate("/signup")}
                style={{ ...styles.button, ...styles.navButton }}
              >
                ✍️ 회원가입 페이지
              </button>

              <button
                onClick={() => navigate("/home")}
                style={{ ...styles.button, ...styles.navButton }}
              >
                🏠 홈 페이지
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{ ...styles.button, ...styles.debugButton }}
              >
                ⬆️ 맨 위로
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 인라인 스타일
const styles = {
  container: {
    minHeight: "100vh",
    height: "auto", // 콘텐츠에 맞춰 높이 자동 조정
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    position: "relative", // 위치 기준점 설정
  },
  scrollWrapper: {
    padding: "20px",
    paddingBottom: "120px", // 하단 여백 더욱 증가
    minHeight: "calc(100vh - 40px)",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box", // 박스 모델 명확화
  },
  card: {
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    position: "relative", // 위치 지정
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "32px",
    fontSize: "32px",
  },
  section: {
    marginBottom: "32px",
    padding: "24px", // 패딩 증가
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    minHeight: "auto", // 최소 높이 자동 조정
  },
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  statusItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  success: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  error: {
    color: "#f44336",
    fontWeight: "bold",
  },
  userInfo: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginTop: "16px",
  },
  infoSection: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    border: "1px solid #e9ecef",
  },
  profileImageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginTop: "16px",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  imageError: {
    padding: "20px",
    backgroundColor: "#fee",
    border: "1px solid #fcc",
    borderRadius: "4px",
    color: "#c00",
  },
  imageInfo: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    border: "1px solid #e9ecef",
  },
  urlText: {
    fontSize: "12px",
    color: "#666",
    wordBreak: "break-all",
    marginTop: "4px",
    padding: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    marginTop: "12px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "16px",
  },
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    minWidth: "120px",
  },
  logoutButton: {
    backgroundColor: "#ff9800",
    color: "white",
  },
  quickLogoutButton: {
    backgroundColor: "#f44336",
    color: "white",
  },
  loginButton: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  debugButton: {
    backgroundColor: "#2196f3",
    color: "white",
  },
  navButton: {
    backgroundColor: "#9c27b0",
    color: "white",
  },
  realTimeInfo: {
    backgroundColor: "#e8f5e8",
    padding: "8px 12px",
    borderRadius: "4px",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#2e7d32",
  },
};

export default TestPage;
