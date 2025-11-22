import express from "express";
import getToken from "../controllers/loginController.js";

const router = express.Router();

router.post("/", getToken);

export default router;
