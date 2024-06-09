import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient } from "@prisma/client";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PoolConfig } from "pg";
import { env_conf } from "../config/env.config";
const db = new PrismaClient();
export const pdf_to_vector = async (project_id: any, pdf_file_key: any) => {
  console.log("pdf_file_path===>", pdf_file_key);
  console.log("open api key", env_conf.openaikey);

  //   PG config

  const tablename = `table_${project_id.toString()}`;
  console.log("tablename===>", tablename);
  const config = {
    postgresConnectionOptions: {
      type: "postgres",
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: {
        rejectUnauthorized: false,
      },
    } as PoolConfig,
    tableName: tablename,
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  };

  const loader = new PDFLoader(pdf_file_key, {
    parsedItemSeparator: "",
  });

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);
  console.log(chunks);

  const open_ai_Embedding = new OpenAIEmbeddings({
    openAIApiKey: env_conf.openaikey,
  });

  const pgvectorStore = await PGVectorStore.initialize(
    open_ai_Embedding,
    config
  );

  if (!pgvectorStore) {
    throw new Error("pgvectorStore not initialized");
  }

  console.log("pgvectorStore===>", pgvectorStore);

  await pgvectorStore.addDocuments([...chunks]);
};
