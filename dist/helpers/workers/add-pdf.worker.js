"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_pdf_queue = void 0;
const bullmq_1 = require("bullmq");
const db_1 = require("../../config/db");
const connection = db_1.connect_redis;
exports.add_pdf_queue = new bullmq_1.Queue("add-pdf", {
    connection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    },
});
exports.add_pdf_queue.add("add-pdf", { data: "data" });
const worker = new bullmq_1.Worker("add-pdf", (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Jobs in worker==>", job.data);
}), {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
});
exports.default = worker;
