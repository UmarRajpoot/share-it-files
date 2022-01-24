import express from "express";
import Path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import db from "./config/db.js";
import FileRouter from "./routes/files.js";
import ShowRouter from "./routes/show.js";
import DownloadRouter from "./routes/download.js";

const app = express();
const PORT = process.env.PORT || 4000;
db();

// Cors
const corsOptions = {
  origin: process.env.ALLOWEDCLIENTS.split(","),
};
app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

app.use(express.static("public"));
app.use(express.json());

// Template Engine
app.set("views", Path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/api/files", FileRouter);
app.use("/files", ShowRouter);
app.use("/files/download", DownloadRouter);

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
