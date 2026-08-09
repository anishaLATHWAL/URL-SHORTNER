import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create and export a Redis client instance.
// Connection URL is read from REDIS_URL in the .env file.
// The client is not connected immediately here to allow the server to
// control when to connect and handle startup ordering.
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({ url: REDIS_URL });

// Attach basic error logging. Callers should `await redisClient.connect()`
// during server startup and handle connection errors.
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connecting...');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

export default redisClient;
