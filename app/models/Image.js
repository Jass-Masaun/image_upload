const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    name: {
      type: String,
      required: [true, "Image name is required"],
    },
    size: {
      type: Number,
      required: [true, "Image Size is required"],
    },
    mimetype: {
      type: String,
      required: [true, "Image mimetype is required"],
    },
    buffer: {
      type: Buffer,
      required: [true, "Buffer is required"],
    },
    thumbnail: {
      type: Buffer,
      required: [true, "Thumbnail is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = {
  Image,
};
