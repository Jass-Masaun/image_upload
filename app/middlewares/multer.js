const path = require("path");
const multer = require("multer");
const { HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");

const storage = multer.memoryStorage();
const fileFilter = (req, file, callback) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  const { name, code } = errors[400];
  if (allowedExtensions.includes(fileExtension)) {
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (file.size > maxSize) {
      callback(
        new HttpError("File size exceeds the limit 5MB", name, [], code)
      );
    }
    callback(null, true);
  } else {
    callback(
      new HttpError("Only jpg, jpeg, png and gif allowed", name, [], code)
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
});

module.exports = {
  upload,
};
