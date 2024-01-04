import express from "express";
import { Login, SignUp } from "../controller/user.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/applicant/information");

export default router;
