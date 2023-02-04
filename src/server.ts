import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "../config/database";
import compression from "compression";

import cookieParser from "cookie-parser";
import Routes from "./routes/v1/index";
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

let server;
// Connect to MongoDB and start the server
connectDB(() => {
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

export default server;
