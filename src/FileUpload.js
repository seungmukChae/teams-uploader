import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useDropzone } from "react-dropzone";
import {
  uploadFileToTeamChannel,
  createShareLink,
  getUserProfile,
} from "./graphClient";

function FileUpload() {
  const { instance, accounts } = useMsal();
  const [isGuest, setIsGuest] = useState(null); // null = 로딩 중

  // ✅ 사용자 정보 가져와서 guest 여부 확인
  useEffect(() => {
    const checkGuest = async () => {
      if (!accounts.length) return;

      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["User.Read", "Sites.ReadWrite.All"],
          account: accounts[0],
        });

        const profile = await getUserProfile(tokenResponse.accessToken);

        console.log("사용자 유형:", profile.userType);
        console.log("userPrincipalName:", profile.userPrincipalName);

        // ✅ userType이 없을 경우 userPrincipalName 기반으로 판단
        const guestCheck =
          profile.userType === "Guest" ||
          (profile.userPrincipalName &&
            profile.userPrincipalName.includes("#EXT#"));

        setIsGuest(guestCheck);
      } catch (err) {
        console.error("사용자 정보 조회 실패", err);
        setIsGuest(false); // 실패 시 멤버로 간주
      }
    };

    checkGuest();
  }, [accounts, instance]);

  const confirmAndUpload = async (file) => {
    if (!window.confirm(`📤 파일을 업로드하시겠습니까?\n"${file.name}"`)) return;

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["Sites.ReadWrite.All"],
        account: accounts[0],
      });

      const accessToken = tokenResponse.accessToken;
      const siteId = "shints2.sharepoint.com,75e89ac8-c4f6-4dbf-85f1-e2834d4ac378,6f96a68c-60dd-4a22-b77c-e40f3d811e0b";
      const folderName = "BVT_MD(TEST)";

      const uploadResult = await uploadFileToTeamChannel(accessToken, siteId, folderName, file);
      const driveId = uploadResult.parentReference.driveId;
      const itemId = uploadResult.id;
      const shareUrl = await createShareLink(accessToken, siteId, driveId, itemId);

      await navigator.clipboard.writeText(shareUrl);
      alert("✅ 업로드 완료! 링크가 복사되었습니다:\n" + shareUrl);
    } catch (error) {
      console.error("❌ 업로드 실패:", error);
      alert("❌ 업로드 실패: " + (error.message || "unknown error"));
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      await confirmAndUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await confirmAndUpload(file);
    }
  };

  // 🔄 사용자 정보 확인 중
  if (isGuest === null) return <p>🔄 사용자 정보를 확인하는 중입니다...</p>;

  // ❌ 멤버는 제한
  if (!isGuest) return <p>🙅 이 앱은 게스트 사용자 전용입니다.</p>;

  // ✅ 게스트는 업로드 UI 표시
  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h3>📂 파일 업로드 (게스트 전용)</h3>
      <input type="file" onChange={handleFileChange} />

      <div
        {...getRootProps()}
        style={{
          marginTop: "20px",
          border: "2px dashed #888",
          borderRadius: "10px",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>🔽 파일을 여기에 놓으세요...</p>
        ) : (
          <p>또는 이 박스에 파일을 드래그하세요</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
