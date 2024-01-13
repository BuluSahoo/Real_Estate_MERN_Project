import express from "express";
import { GetData } from "../controllers/user.controller.js";

const router = express.Router()

router.get('/get-data', GetData)

export default router
