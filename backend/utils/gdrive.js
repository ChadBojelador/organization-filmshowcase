function extractGoogleDriveFileId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();

  // Matches: /file/d/<FILE_ID>/...
  const filePathMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (filePathMatch) {
    return filePathMatch[1];
  }

  // Matches: ?id=<FILE_ID>
  const queryIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryIdMatch) {
    return queryIdMatch[1];
  }

  // Matches: /uc?export=view&id=<FILE_ID> and variants already covered by query, fallback:
  const openIdMatch = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch) {
    return openIdMatch[1];
  }

  return null;
}

function toVideoEmbedUrl(url) {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) {
    return url;
  }

  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function toPosterDirectUrl(url) {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) {
    return url;
  }

  return `https://drive.google.com/uc?id=${fileId}`;
}

function convertSubmissionLinks(videoLink, posterLink) {
  return {
    videoLink: toVideoEmbedUrl(videoLink),
    posterLink: toPosterDirectUrl(posterLink)
  };
}

module.exports = {
  extractGoogleDriveFileId,
  toVideoEmbedUrl,
  toPosterDirectUrl,
  convertSubmissionLinks
};
