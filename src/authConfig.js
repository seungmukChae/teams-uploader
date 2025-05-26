export const msalConfig = {
  auth: {
    clientId: "0abca3da-8de2-43d2-8ff3-5a8090162c4c",
    authority: "https://login.microsoftonline.com/shints2.onmicrosoft.com",
    redirectUri: "https://stellar-sopapillas-adb6a7.netlify.app", // ← 여기에 Netlify 주소 입력
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};