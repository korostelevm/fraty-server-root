require("dotenv").config();
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import connectDB from "../config/database";
import compression from "compression";

import cookieParser from "cookie-parser";
import Routes from "./routes/v1/index";
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(compression());

app.use("/v1", Routes);
app.get("/", (req, res) => {
  return res.json({
    status: 200,
    message: "gm frens! API is running",
  });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default server;
