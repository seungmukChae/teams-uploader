// App.js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import FileUpload from "./FileUpload";

function App() {
  const { instance, accounts } = useMsal();
  const isInIframe = window.self !== window.top;
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance
      .loginPopup({
        ...loginRequest,
        prompt: "select_account",
      })
      .catch((e) => {
        console.error("로그인 오류:", e);
      });
  };

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
    });
  };

  const handleConnectClick = () => {
    window.open("https://stellar-sopapillas-adb6a7.netlify.app", "_blank");
  };

  if (isInIframe) {
    // Teams 탭 안에서 보일 화면
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>파일 업로드 도구 연결</h2>
        <p>외부 브라우저에서 도구를 실행하려면 아래 버튼을 클릭하세요.</p>
        <button
          onClick={handleConnectClick}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "#0078D4",
            color: "white",
            border: "none",
          }}
        >
          🔗 연결
        </button>
      </div>
    );
  }

  // 브라우저에서 열린 경우
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Microsoft 365 로그인 데모</h1>
      {!isAuthenticated ? (
        <button onClick={handleLogin}>🔐 Microsoft로 로그인</button>
      ) : (
        <div>
          <p>✅ 로그인됨: {accounts[0].username}</p>
          <button onClick={handleLogout}>🚪 로그아웃</button>
          <hr />
          <FileUpload />
        </div>
      )}
    </div>
  );
}

export default App;
