const { HttpError } = require("./apiResponse");
const { errors } = require("./errors");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.status === false) {
    return res.status(err.status_code).json(err);
  }

  const { name, code } = errors[500];
  const error = new HttpError("Server Error", name, [err], code);

  res.status(error.status_code).json(error);
};

module.exports = {
  errorHandler,
};
