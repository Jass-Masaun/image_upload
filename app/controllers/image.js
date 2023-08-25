const { Image } = require("../models");

const { HttpSuccess, HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");
const { handleFreeTrierImageUploadCondition } = require("../services/image");
const { generateThumbnailBuffer } = require("../services/sharp");

const { DOMAIN } = process.env;

const storeImage = async (req, res, next) => {
  try {
    if (!req.files || req?.files?.length === 0) {
      const { name, code } = errors[400];
      throw new HttpError("Image is required", name, [], code);
    }

    await handleFreeTrierImageUploadCondition(req.user);

    const imagesToUpload = [];

    for (let i = 0; i < req.files.length; i++) {
      const obj = req.files[i];
      const { mimetype, buffer, originalname, size } = obj;

      const thumbnailBuffer = await generateThumbnailBuffer(buffer);

      imagesToUpload.push({
        user: req.user.id,
        name: originalname,
        size,
        mimetype,
        buffer,
        thumbnail: thumbnailBuffer,
      });
    }

    await Image.insertMany(imagesToUpload);

    const response = new HttpSuccess("Image uploaded successfully", null);
    res.status(response.status_code).json(response);
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

    const image = await Image.findById(id, { thumbnail: 1, mimetype: 1 });

    if (!image) {
      const { name, code } = errors[404];
      throw new HttpError("Image not found", name, [], code);
    }

    res.setHeader("Content-Type", image.mimetype);
    // res.send(type === "thumbnail" ? image.thumbnail : image.buffer);
    res.send(image.thumbnail);
  } catch (error) {
    next(error);
  }
};

const getAllImages = async (req, res, next) => {
  try {
    const { id } = req.user;

    const images = await Image.find(
      {
        user: id,
      },
      { _id: 1, name: 1, size: 1, mimetype: 1, createdAt: 1 }
    );

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
