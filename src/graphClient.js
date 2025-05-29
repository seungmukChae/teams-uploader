import { Buffer } from "buffer";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

window.Buffer = Buffer;

export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

export async function uploadFileToTeamChannel(accessToken, siteId, folderName, file, itemId) {
  const client = getGraphClient(accessToken);

  // 문서 드라이브 찾기
  const drives = await client.api(`/sites/${siteId}/drives`).get();
  const drive = drives.value.find(d => d.name === "Documents" || d.name === "문서");
  if (!drive) throw new Error("문서 드라이브를 찾을 수 없습니다.");
  const driveId = drive.id;

  const fileContent = await file.arrayBuffer();

  // 업로드 실행
  const uploadResult = await client
    .api(`/sites/${siteId}/drives/${driveId}/root:/${folderName}/${file.name}:/content`)
    .put(fileContent);

  return uploadResult;

}

// 공유 링크 생성 함수
export async function createShareLink(accessToken, siteId, driveId, itemId) {
  const client = getGraphClient(accessToken);

  const response = await client
    .api(`/sites/${siteId}/drives/${driveId}/items/${itemId}/createLink`)
    .post({
      type: "view", // "edit", "embed" , "view"
      scope: "organization" // "organization", "anonymous"
    });

  return response.link.webUrl;
}

// ✅ 사용자 프로필 함수 (department 포함)
export async function getUserProfile(accessToken) {
  const client = getGraphClient(accessToken);
  const profile = await client
  .api("/me?$select=displayName,department,userPrincipalName,userType")  
  .get();
  return profile;
}
