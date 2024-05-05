import express from "express";
import {
  createListing,
  deleteListings,
  updateListings,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { veryfyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing);
router.delete("/delete/:id", veryfyToken, deleteListings);
router.post("/update/:id", veryfyToken, updateListings);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
