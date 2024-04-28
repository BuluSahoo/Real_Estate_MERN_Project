import express from "express";
import { createListing, getUserListings, deleteListings, updateListings, getListings } from "../controllers/listing.controller.js";
import { veryfyToken } from "../utils/verifyUser.js";

const router = express.Router()

router.post('/create', createListing)
router.get('/:id', veryfyToken, getUserListings)
router.delete('/delete/:id', veryfyToken, deleteListings)
router.post('/update/:id', veryfyToken, updateListings)
router.get('/get/:id', getListings)


export default router