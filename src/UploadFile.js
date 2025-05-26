import React from "react";
import { useMsal } from "@azure/msal-react";
import { uploadFileToTeamChannel } from "./graphClient";

function UploadFile() {
  const { instance, accounts } = useMsal();

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !accounts.length) return;

    const tokenResponse = await instance.acquireTokenSilent({
      scopes: ["Sites.ReadWrite.All"],
      account: accounts[0],
    });

    try {
      const result = await uploadFileToTeamChannel(
        tokenResponse.accessToken,
        "shints_system",      // 팀 이름 = SharePoint 사이트명
        "BVT_MD(TEST)",        // 채널 폴더명
        file
      );
      alert("✅ 업로드 성공: " + result.name);
    } catch (e) {
      console.error("업로드 실패:", e);
      alert("❌ 업로드 실패" + (e.message || JSON.stringify(e)));
    }
  };

  return (
    <div>
      <h3>파일 선택 후 Teams 채널로 업로드</h3>
      <input type="file" onChange={handleChange} />
    </div>
  );
}

export default UploadFile;
