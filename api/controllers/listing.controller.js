import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req, res, next) =>{
     try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)
     } catch (error) {
        next(error)
     }
}

export const getUserListings =async (req, res, next) =>{
   if(req.user.id === req.params.id){
     try {
       const listings = await Listing.find({userRef:req.params.id})
       res.status(200).json(listings)
     } catch (error) {
       next(error)
     }
   }else{
     return next(errorHandler(401, "You can only view your own listings"))
   }
   }