const { HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");
const { Image } = require("../models");
const { getTwoDateDifferenceInMs } = require("../utils/datetime");

const getRecentImageUploadedByUser = async (userId) => {
  const image = await Image.findOne(
    {
      user: userId,
    },
    {},
    { sort: { createdAt: -1 }, limit: 1 }
  );

  return image;
};

const handleFreeTrierImageUploadCondition = async (user) => {
  if (user.tier === "free") {
    const image = await getRecentImageUploadedByUser(user.id);

    if (image && image.createdAt) {
      const timeDifferenceInMs = getTwoDateDifferenceInMs(
        new Date(),
        image.createdAt
      );

      const timeDifferenceInHour = timeDifferenceInMs / (1000 * 60 * 60);

      if (timeDifferenceInHour < 1) {
        const { name, code } = errors[400];
        throw new HttpError(
          "You can uplaod only one image in hour",
          name,
          [],
          code
        );
      }
    }
  }
};

module.exports = {
  handleFreeTrierImageUploadCondition,
};
