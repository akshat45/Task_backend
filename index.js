import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import { auth} from "./middlewares/auth.js";
import { errorHandler } from "./helpers/errorHandler.js";
import userRoute from "./routes/userRoute.js";


const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(auth);
app.use("/user", userRoute);
app.use((err, req, res, next) => errorHandler(err, req, res, next));



const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`The server is running on port: ${PORT}`)
    )
  )
  .catch((error) => console.log(error.message));
