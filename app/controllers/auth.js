const bcrypt = require("bcrypt");

const { User } = require("../models");
const { errors } = require("../handlers/errors");
const { HttpSuccess, HttpError } = require("../handlers/apiResponse");
const { createUserBody } = require("../validators/auth");
const { handleValidationResult } = require("../utils/validator");
const { generateToken } = require("../helpers/jwt");

const createUser = async (req, res, next) => {
  try {
    handleValidationResult(createUserBody, req.body);

    const { full_name, email, password } = req.body;

    let user = await User.findOne({
      email,
    });

    if (user) {
      const { name, code } = errors[400];
      throw new HttpError(
        "User already exists with this email",
        name,
        [],
        code
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      full_name,
      email,
      password: hashedPassword,
      tier: "free",
    });

    await user.save();

    const response = new HttpSuccess(
      "User created successfully",
      {
        full_name,
        email,
      },
      201
    );
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      const { name, code } = errors[400];
      throw new HttpError("Invalid credentials", name, [], code);
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      const { name, code } = errors[400];
      throw new HttpError("Invalid credentials", name, [], code);
    }

    const tokens = generateToken(user);

    const response = new HttpSuccess("User verified", tokens);

    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
};
