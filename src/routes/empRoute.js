import express from "express";
import getEmpStatus from "../controllers/empController.js";

const router = express.Router();

router.post("/", getEmpStatus);

export default router;
