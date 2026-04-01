const GDRIVE_FILE_ID_REGEX = /\/d\/([a-zA-Z0-9_-]+)/;

export function extractGoogleDriveFileId(url = "") {
  if (!url) return "";

  const match = url.match(GDRIVE_FILE_ID_REGEX);
  if (match?.[1]) return match[1];

  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("id") || "";
  } catch {
    return "";
  }
}

export function toGoogleDrivePosterUrl(url = "") {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?id=${fileId}`;
}

export function toGoogleDriveVideoEmbedUrl(url = "") {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
