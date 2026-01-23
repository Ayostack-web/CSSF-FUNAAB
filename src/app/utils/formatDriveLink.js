// src/utils/formatDriveLink.js
export const getDriveStreamLink = (url) => {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) {
    // This format is specifically for embedding the Google player
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};