const sharp = require("sharp");

const generateThumbnailBuffer = async (
  inputBuffer,
  maxWidth,
  maxHeight,
  maxFileSize
) => {
  let minQuality = 1; // Minimum quality value
  let maxQuality = 100; // Maximum quality value
  let thumbnailQuality = Math.floor((minQuality + maxQuality) / 2);

  let thumbnailBuffer = null;
  while (minQuality <= maxQuality) {
    const resizedImage = await sharp(inputBuffer)
      .resize(maxWidth, maxHeight, { fit: "inside", withoutEnlargement: true })
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

const { Image } = require("../models");

const { HttpSuccess, HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");
const { handleFreeTrierImageUploadCondition } = require("../services/image");

const { DOMAIN } = process.env;

const storeImage = async (req, res, next) => {
  try {
    if (!req.files || req?.files?.length === 0) {
      const { name, code } = errors[400];
      throw new HttpError("Image is required", name, [], code);
    }

    await handleFreeTrierImageUploadCondition(req.user);

    const imagesToUpload = [];

    req.files.map(async (obj, index) => {
      const { mimetype, buffer, originalname, size } = obj;

      const thumbnailBuffer = await generateThumbnailBuffer(
        buffer,
        200,
        150,
        100
      );

      imagesToUpload.push({
        user: req.user.id,
        name: originalname,
        size,
        mimetype,
        buffer,
        thumbnail: thumbnailBuffer,
      });

      if (req.files.length - 1 === index) {
        await Image.insertMany(imagesToUpload);

        const response = new HttpSuccess("Image uploaded successfully", null);
        res.status(response.status_code).json(response);
      }
    });
  } catch (error) {
    next(error);
  }
};

const downloadImage = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const { name, code } = errors[404];
      throw new HttpError("Image not found", name, [], code);
    }

    const image = await Image.findById(id);

    if (!image) {
      const { name, code } = errors[404];
      throw new HttpError("Image not found", name, [], code);
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${image.name}"`
    );
    res.setHeader("Content-Type", image.mimetype);
    res.send(image.buffer);
  } catch (error) {
    next(error);
  }
};

const viewImage = async (req, res, next) => {
  try {
    const { id, type } = req.query;

    if (!id) {
      const { name, code } = errors[404];
      throw new HttpError("Image not found", name, [], code);
    }

    const image = await Image.findById(id);

    if (!image) {
      const { name, code } = errors[404];
      throw new HttpError("Image not found", name, [], code);
    }

    res.setHeader("Content-Type", image.mimetype);
    res.send(type === "thumbnail" ? image.thumbnail : image.buffer);
  } catch (error) {
    next(error);
  }
};

const getAllImages = async (req, res, next) => {
  try {
    const { id } = req.user;

    const images = await Image.find({
      user: id,
    });

    const result = images.map((image) => {
      const { _id, name, size, mimetype, createdAt } = image;
      return {
        name,
        size,
        mimetype,
        view_link: `${DOMAIN}/image/view?id=${_id}`,
        download_link: `${DOMAIN}/image/download?id=${_id}`,
        created_at: createdAt,
      };
    });

    const response = new HttpSuccess("Images list", { images: result });
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  storeImage,
  downloadImage,
  viewImage,
  getAllImages,
};
