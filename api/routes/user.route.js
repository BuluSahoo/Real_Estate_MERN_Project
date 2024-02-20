import express from "express";
import { GetData, updateUser } from "../controllers/user.controller.js";
import { veryfyToken } from "../utils/verifyUser.js";

const router = express.Router()

router.get('/get-data', GetData)
router.post('/update/:id', veryfyToken, updateUser)


export default router
