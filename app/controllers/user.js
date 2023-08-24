const { HttpSuccess } = require("../handlers/apiResponse");
const { getUserDetailsById } = require("../services/user");

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await getUserDetailsById(id);

    const response = new HttpSuccess("User details", user);
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserDetails,
};
