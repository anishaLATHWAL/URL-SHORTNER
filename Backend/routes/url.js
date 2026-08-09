import express from "express";
import Url from "../models/url.js";
import { nanoid } from "nanoid";
import redisClient from "../config/redisClient.js";

const router = express.Router();

router.post("/shorten", async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        try {
            new URL(originalUrl);
        } catch (error) {
            return res.status(400).json({
                error: "Invalid URL"
            });
        }

        let shortId;
        let exists = true;

        while (exists) {
            shortId = nanoid(7);

            exists = await Url.findOne({
                shortID: shortId
            });
        }

        const url = await Url.create({
            shortID: shortId,
            originalUrl
        });

        res.json({
            shortId: url.shortID,
            shortUrl: `${process.env.BASE_URL}/${url.shortID}`
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });
    }
});

router.get("/:shortID", async (req, res) => {
    try {

        const { shortID } = req.params;

        // Cache key for Redis
        const cacheKey = `url:${shortID}`;

        try {
            // 1) Try reading from Redis cache first (cache-first strategy)
            const cached = await redisClient.get(cacheKey);

            if (cached) {
                // Redis cache hit: log and redirect immediately
                console.log('Redis Cache Hit', cacheKey);
                // increment click count in the background (best-effort)
                Url.findOneAndUpdate({ shortID }, { $inc: { clicks: 1 } }).catch(() => {});
                return res.redirect(cached);
            }
        } catch (redisErr) {
            // Log Redis errors but continue to DB lookup so service remains functional
            console.error('Redis error while getting key', cacheKey, redisErr);
        }

        // 2) Cache miss: query MongoDB
        const url = await Url.findOne({ shortID });

        if (!url) {
            return res.status(404).json({
                error: "URL NOT FOUND"
            });
        }

        // 3) Store in Redis with TTL (1 hour) for future requests.
        try {
            await redisClient.setEx(cacheKey, 3600, url.originalUrl);
            console.log('Redis Cache Miss - stored', cacheKey);
        } catch (redisErr) {
            console.error('Redis error while setting key', cacheKey, redisErr);
        }

        url.clicks += 1;
        await url.save();

        return res.redirect(url.originalUrl);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Server Error"
        });
    }
});

export default router;