import express from "express";
import { Login, SignUp, deleteJob, getAdmin } from "../controller/admin.js";

const router = express.Router();
router.post("/signup", SignUp);

router.post("/login", Login);
router.post("/create", SignUp);
// read
router.get("/:id/profile", getAdmin);
router.get("/applicants");
// deleta
router.patch("/:id/jobs/delete", deleteJob);
export default router;
