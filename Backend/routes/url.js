import express from "express";
import Url from "../models/url";
import { nanoid } from "nanoid";
import url from "../models/url";

const router = express.Router();

router.post("/shorten", async (req,res)=>{
    try{

        const { originalUrl } = req.body;

        if(!originalUrl){
            res.status(400).json({error : "URL is required"});
        }

        try{
            new URL(originalUrl)
        }
        catch(error){
            return res.status(400).json({error : "Invalid URL.. "})
        }

        let shortId;
        let exists = true;

        while(exists){
            shortId = nanoId(7);
            exists = await Url.findOne({shortID});
        }

        const url = await Url.create({
            shortID, originalUrl
        });

        res.json({
            shortId: url.shortID,
            shortUrl: 
        })

    }
    catch(err){
        console.log(error);
        res.status(500).json({error : "Server Error"}); 
    }
})