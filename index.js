import express from "express";
import cors from "cors";

// express server
const app = express();
app.use(express.json());
app.use(cors());
