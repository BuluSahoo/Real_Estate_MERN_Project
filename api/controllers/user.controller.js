import User from "../models/user.model.js";



export const GetData=async(req, res, next)=>{
    try {
        const users = await User.find();
        res.json(users);
      } catch (error) {
        next(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    }