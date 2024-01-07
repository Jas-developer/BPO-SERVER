import express from "express";
import { Login, SignUp, deleteJob, getAdmin } from "../controller/admin.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.post("/signup", SignUp);

router.post("/login", Login);
router.post("/create", SignUp);
// read
router.get("/:id/profile", verifyToken, getAdmin);
router.get("/applicants");
// deleta
router.patch("/:id/jobs/delete", verifyToken, deleteJob);

export default router;
