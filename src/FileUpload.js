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
  const [isGuest, setIsGuest] = useState(null);
  const [userInfo, setUserInfo] = useState({
    displayName: "",
    department: "",
  });

  useEffect(() => {
    const checkGuest = async () => {
      if (!accounts.length) return;

      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["User.Read", "Sites.ReadWrite.All"],
          account: accounts[0],
        });

        const profile = await getUserProfile(tokenResponse.accessToken);

        const guestCheck =
          profile.userType === "Guest" ||
          (profile.userPrincipalName &&
            profile.userPrincipalName.includes("#EXT#"));

        setIsGuest(guestCheck);
        setUserInfo({
          displayName: profile.displayName || "",
          department: profile.department || "",
        });
      } catch (err) {
        console.error("Failed to retrieve user information", err);
        setIsGuest(false);
      }
    };

    checkGuest();
  }, [accounts, instance]);

  const getUploadTarget = (department) => {
    if (department.startsWith("(ETP)")) {
      return {
        siteId: "shints2.sharepoint.com,e314b8ee-c9c5-4bbc-aefb-df51e648c21d,589ef99d-99fe-4fd7-8981-548305c668b4", // ← 실제 ETP 팀 siteId로 바꾸세요
        folderName: "File_Upload(ETP_Guest)",
      };
    } else if (department.startsWith("(BVT)")) {
      return {
        siteId: "shints2.sharepoint.com,efc56264-28f5-41cc-923a-f9c2bc3ca33b,526ee517-fb8e-4849-8d98-6acc71e7a83d", // ← 실제 BVT 팀 siteId로 바꾸세요
        folderName: "File_Upload(BVT_Guest)",
      };
    } else {
      return null;
    }
  };

  const confirmAndUpload = async (file) => {
    if (!window.confirm(`📤 Would you like to upload this file?\n"${file.name}"`)) return;

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["Sites.ReadWrite.All"],
        account: accounts[0],
      });

      const accessToken = tokenResponse.accessToken;

      const target = getUploadTarget(userInfo.department);
      if (!target) {
        alert("❌ This department is not allowed to upload files.");
        return;
      }

      const uploadResult = await uploadFileToTeamChannel(
        accessToken,
        target.siteId,
        target.folderName,
        file
      );

      const driveId = uploadResult.parentReference.driveId;
      const itemId = uploadResult.id;
      const shareUrl = await createShareLink(accessToken, target.siteId, driveId, itemId);

      await navigator.clipboard.writeText(shareUrl);
      alert("✅ Upload complete! The link has been copied:\n" + shareUrl);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("❌ Upload failed: " + (error.message || "unknown error"));
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

  if (isGuest === null) return <p>🔄 Checking user information...</p>;
  if (!isGuest) return <p>🙅 This app is for guest users only.</p>;

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h3>📂 File Upload (Guest Only)</h3>
      <p>!!!Your Profile Information!!!</p>
      <p>👤 Name: {userInfo.displayName}</p>
      <p>🏢 Department: {userInfo.department}</p>

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
          <p>🔽 Drop the file here...</p>
        ) : (
          <p>Or drag the file into this box</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
