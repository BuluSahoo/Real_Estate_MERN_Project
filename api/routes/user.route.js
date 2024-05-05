import express from "express";
import { GetData, deleteUser, updateUser, getUser, getUserListings } from "../controllers/user.controller.js";
import { veryfyToken } from "../utils/verifyUser.js";

const router = express.Router()

router.get('/get-data', GetData)
router.get("/:id", veryfyToken, getUserListings);
router.post('/update/:id', veryfyToken, updateUser)
router.delete('/delete/:id', veryfyToken, deleteUser)
router.get('/:id', veryfyToken, getUser)




export default router
