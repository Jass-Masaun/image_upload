const { Image } = require("../models");

const { HttpSuccess, HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");
const { handleFreeTrierImageUploadCondition } = require("../services/image");

const storeImage = async (req, res, next) => {
  try {
    if (!req.files || req?.files?.length === 0) {
      const { name, code } = errors[400];
      throw new HttpError("Image is required", name, [], code);
    }

    await handleFreeTrierImageUploadCondition(req.user);

    const imagesToUpload = [];

    req.files.map((obj) => {
      const { mimetype, buffer, originalname, size } = obj;
      imagesToUpload.push({
        user: req.user.id,
        name: originalname,
        size,
        mimetype,
        buffer,
      });
    });

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

    res.setHeader("Content-Type", image.mimetype);
    res.send(image.buffer);
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
