require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./app/routes");
const { errorHandler } = require("./app/handlers/errorHandler");
const { connectDb } = require("./app/config/db");

const app = express();

connectDb();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.json({ message: "api working!" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
