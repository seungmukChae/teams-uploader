// App.js
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import FileUpload from "./FileUpload";

function App() {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance
      .loginPopup({
        ...loginRequest,
        prompt: "select_account", // ✅ 계정 선택창 강제
      })
      .catch((e) => {
        console.error("로그인 오류:", e);
      });
  };

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/", // 또는 로그인 화면
    });
  };

  const isAuthenticated = accounts.length > 0;

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
