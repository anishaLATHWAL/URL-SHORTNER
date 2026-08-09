import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from './routes/url.js';
import redisClient from './config/redisClient.js';

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.use(cors({
        origin: FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use(express.json());

app.use("/", urlRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
                // Connect to Redis before starting the server. If Redis fails to connect
                // we log the error but still start the server to avoid downtime for DB-only operations.
                redisClient.connect()
                    .then(() => {
                        console.log('Connected to Redis');
                    })
                    .catch((err) => {
                        console.error('Redis connection failed', err);
                    })
                    .finally(() => {
                        app.listen(PORT, () => {
                            console.log(`Server is running on ${PORT}`);
                        });
                    });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });
