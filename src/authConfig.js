const isLocalhost = window.location.hostname === "localhost";

export const msalConfig = {
  auth: {
    clientId: "0abca3da-8de2-43d2-8ff3-5a8090162c4c",
    authority: "https://login.microsoftonline.com/shints2.onmicrosoft.com",
    redirectUri: isLocalhost
      ? "http://localhost:3000"
      : "https://stellar-sopapillas-adb6a7.netlify.app", // ← 실제 Netlify 주소로 교체
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Sites.ReadWrite.All", "openid", "profile"],
  prompt: "select_account",
};
