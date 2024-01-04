import express from "express";
import cors from "cors";
import UserRouter from "./src/routes/user.js";
import AdminRouter from "./src/routes/admin.js";
import { connectDB } from "./src/database/DatabaseConnection.js";
// express server
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.route("/users", UserRouter);
app.route("/admin", AdminRouter);

app.listen(5000, () => {
  console.log("Express is listening to port 5000");
});
