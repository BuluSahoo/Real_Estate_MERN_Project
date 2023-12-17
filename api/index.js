import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'


mongoose.connect(process.env.MONGO).then(() => {
  console.log("connected to Mongodb");
})
.catch((err)=>{
    console.log(err,"problem in databae connection")
});
const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running at port 3000 !!");
});


app.use('/api/v1/user', userRouter)
app.use('/api/v1/auth', authRouter )

