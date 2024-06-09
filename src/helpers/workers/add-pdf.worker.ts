import { PrismaClient } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import { connect_redis } from "../../config/db";
import { pdf_to_vector } from "../pdf-into-vector";
const db = new PrismaClient();
const connection = connect_redis;
export const add_pdf_queue = new Queue("add-pdf", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

const worker = new Worker(
  "add-pdf",
  async (job) => {
    console.log("Jobs in worker==>", job.data);
    const { project_id, pdf_file_key } = job.data;
    const pdf_info = await pdf_to_vector(project_id, pdf_file_key);
    console.log("pdf_info===>", pdf_info);
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
  }
);

export default worker;
