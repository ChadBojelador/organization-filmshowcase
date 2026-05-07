const DRIVE_FILE_ID_REGEX = /^[a-zA-Z0-9_-]{10,}$/;

function isLikelyFileId(value) {
  return typeof value === "string" && DRIVE_FILE_ID_REGEX.test(value.trim());
}

function extractGoogleDriveFileId(input) {
  if (!input || typeof input !== "string") {
    return null;
  }

  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return null;
  }

  if (isLikelyFileId(trimmedInput)) {
    return trimmedInput;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmedInput);
  } catch {
    return null;
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (!hostname.includes("drive.google.com") && !hostname.includes("docs.google.com")) {
    return null;
  }

  const searchId = parsedUrl.searchParams.get("id");
  if (isLikelyFileId(searchId)) {
    return searchId.trim();
  }

  const segments = parsedUrl.pathname.split("/").filter(Boolean);
  const dSegmentIndex = segments.indexOf("d");
  if (dSegmentIndex !== -1 && isLikelyFileId(segments[dSegmentIndex + 1])) {
    return segments[dSegmentIndex + 1].trim();
  }

  const fileSegmentIndex = segments.indexOf("file");
  if (fileSegmentIndex !== -1 && segments[fileSegmentIndex + 1] === "d") {
    const fileId = segments[fileSegmentIndex + 2];
    if (isLikelyFileId(fileId)) {
      return fileId.trim();
    }
  }

  return null;
}

function buildGoogleDrivePlaybackUrls(fileId) {
  const id = (fileId || "").trim();

  return {
    fileId: id,
    videoEmbedUrl: `https://drive.google.com/file/d/${id}/preview`,
    videoSourceUrl: `https://drive.google.com/uc?export=download&id=${id}`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
  };
}

module.exports = {
  extractGoogleDriveFileId,
  buildGoogleDrivePlaybackUrls,
};
