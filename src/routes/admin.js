import express from "express";
import { Login, SignUp } from "../controller/admin.js";

const router = express.Router();
router.post("/signup", SignUp);

router.post("/login", Login);
router.post("/create");
router.get("/applicanst");
export default router;
