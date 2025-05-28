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
        <h2>Connect to File Upload Tool</h2>
        <p>To run the tool in an external browser, please click the "OPEN" button below.</p>
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
          🔗 OPEN
        </button>
      </div>
    );
  }

  // 브라우저에서 열린 경우
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>File Upload Tool</h1>
      <h3>Please log in using your Teams email address!</h3>
      {!isAuthenticated ? (
        <button onClick={handleLogin}>🔐 Sign in with Microsoft</button>
      ) : (
        <div>
          <p>✅ Signed in: {accounts[0].username}</p>
          <button onClick={handleLogout}>🚪 Signed out</button>
          <hr />
          <FileUpload />
        </div>
      )}
    </div>
  );
}

export default App;
