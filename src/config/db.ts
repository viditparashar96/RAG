import { Redis } from "ioredis";
export const connect_redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: 12171,
  maxRetriesPerRequest: null,
});
