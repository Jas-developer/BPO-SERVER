import express from "express";
import cors from "cors";
import UserRouter from "./src/routes/user.js";
import AdminRouter from "./src/routes/admin.js";
import { connectDB } from "./src/database/DatabaseConnection.js";
import multer from "multer";
import { createJob } from "./src/controller/admin.js";
import { verifyToken } from "./src/middleware/auth.js";
import bodyParser from "body-parser";
// express server
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
connectDB();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload
app.patch(
  "/admin/:id/jobs/upload",
  upload.single("file"),
  verifyToken,
  createJob
);

// Serve uploaded files statically from '/uploads' path
app.use("/uploads", express.static("public/uploads"));

// Serve other static files from the 'public' folder
app.use(express.static("public"));

// standard
app.use("/users", UserRouter);
app.use("/admin", AdminRouter);

app.listen(5000, () => {
  console.log("Express is listening to port 5000");
});
