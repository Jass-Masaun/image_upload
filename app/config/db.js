const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

const connectDb = async () => {
  try {
    const {
      connection: { host, port },
    } = await mongoose.connect(MONGODB_URI);

    console.log(`Database connected: ${host} ${port}`);
  } catch (error) {
    console.log("Unable to connect to database", error);
    process.exit(1);
  }
};

module.exports = {
  connectDb,
};
