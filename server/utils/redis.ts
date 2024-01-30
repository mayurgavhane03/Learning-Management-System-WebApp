import { Redis } from 'ioredis';
import dotenv from 'dotenv';

// Call the config method to load environment variables from .env file
dotenv.config();

const redisClient = () => {
    try {
        if (process.env.REDIS_URL) {
            console.log("Redis connected");
            return process.env.REDIS_URL;
        }
        throw new Error("Redis Connection Failed");
    } catch (err:any) {
        throw new Error(err.message);
    }
}

export const redis = new Redis(redisClient());
