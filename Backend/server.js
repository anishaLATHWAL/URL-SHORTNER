import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config(); 


const app = express();

app.get("/",(req,res)=>{
    res.send("Hello World");
})

mongoose.connect(process.env.MONGO_URI)
.then
(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on ${process.env.PORT}`);
    });
})

// app.listen(5000, ()=>{
//     console.log("Server is running on port 5000");
// })