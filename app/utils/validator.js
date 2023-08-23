const { HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");

const handleValidationResult = (validator, body) => {
  const validationResult = validator.validate(body);
  const errorDetails = validationResult?.error?.details;

  if (errorDetails) {
    const { name, code } = errors[400];
    throw new HttpError(
      errorDetails[0].message,
      name,
      errorDetails.map((obj) => obj.message),
      code
    );
  }
};

module.exports = {
  handleValidationResult,
};
