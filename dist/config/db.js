"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect_redis = void 0;
const ioredis_1 = require("ioredis");
exports.connect_redis = new ioredis_1.Redis({
    host: "redis-12171.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    password: "EshkcuCGeBiNEJ38PGwb05njW9ql200X",
    port: 12171,
    maxRetriesPerRequest: null,
});
