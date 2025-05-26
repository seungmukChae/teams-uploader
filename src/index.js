import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// MSAL 관련 코드
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

// Buffer 설정은 import 이후에 실행
window.Buffer = Buffer;

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
