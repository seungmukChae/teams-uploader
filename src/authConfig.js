export const msalConfig = {
  auth: {
    clientId: "0abca3da-8de2-43d2-8ff3-5a8090162c4c",
    authority: "https://login.microsoftonline.com/shints2.onmicrosoft.com", // 또는 tenant-specific
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Sites.ReadWrite.All", "openid", "profile"], // ✅ 반드시 openid 포함
  prompt: "select_account",
};
