import express from "express";
import { createListing, getUserListings, deleteListings } from "../controllers/listing.controller.js";
import { veryfyToken } from "../utils/verifyUser.js";

const router = express.Router()

router.post('/create', createListing)
router.get('/:id', veryfyToken, getUserListings)
router.delete('/delete/:id', veryfyToken, deleteListings)



export default router