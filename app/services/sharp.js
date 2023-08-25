const sharp = require("sharp");

const generateThumbnailBuffer = async (inputBuffer) => {
  let minQuality = 1; // Minimum quality value
  let maxQuality = 100; // Maximum quality value
  let thumbnailQuality = Math.floor((minQuality + maxQuality) / 2);
  const maxFileSize = 200;

  let thumbnailBuffer = null;
  while (minQuality <= maxQuality) {
    const resizedImage = await sharp(inputBuffer)
      .jpeg({ quality: thumbnailQuality })
      .toBuffer();

    if (resizedImage.length <= maxFileSize * 1024) {
      thumbnailBuffer = resizedImage;
      break;
    } else {
      if (resizedImage.length > maxFileSize * 1024) {
        maxQuality = thumbnailQuality - 1;
      } else {
        minQuality = thumbnailQuality + 1;
      }
      thumbnailQuality = Math.floor((minQuality + maxQuality) / 2);
    }
  }

  return thumbnailBuffer;
};

module.exports = {
  generateThumbnailBuffer,
};
