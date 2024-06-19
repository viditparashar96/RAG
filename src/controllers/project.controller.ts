import prisma from "../config/dbclient";
import { chatWithPdf } from "../helpers/chat-with-pdf";
import addpdfworker, { add_pdf_queue } from "../helpers/workers/add-pdf.worker";
import { getChatHistory, saveChatMessage } from "../libs/utils";
export const createProject = async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    console.log("req.file====>", req.file);
    if (!name || !description) {
      return res.status(400).json("Please fill all fields");
    }
    console.log("curennt user id====>", req.user.id);

    const createdProject: any = await prisma.project.create({
      data: {
        name: name,
        description: description,
        vectortable: "",
        pdf_file_key: req.file.path,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    const send_data_to_queue = add_pdf_queue.add("add-pdf", {
      project_id: createdProject.id,
      pdf_file_key: createdProject.pdf_file_key,
    });

    addpdfworker.on("completed", async (job) => {
      console.log(`Job completed with result data==>`, job.data);
      const updatePorject = await prisma.project.update({
        where: {
          id: job.data.project_id,
        },
        data: {
          status: "COMPLETED",
          vectortable: "table_" + job.data.project_id,
        },
      });
      console.log("updatePorject when job is done===>", updatePorject);
      res.status(201).json({ updatePorject, send_data_to_queue });
      prisma.$disconnect();
    });
    addpdfworker.on("failed", async (job, err) => {
      console.log(`Job failed with error==>`, err);
      const updatePorject = await prisma.project.update({
        where: {
          id: job?.data.project_id,
        },
        data: {
          status: "FAILED",
        },
      });
      console.log("updatePorject when job is failed===>", updatePorject);
      res.status(201).json({ updatePorject, send_data_to_queue });
      prisma.$disconnect();
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProject = async (req: any, res: any) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        user: {
          id: req.user.id,
        },
      },
    });
    res.status(200).json(projects);
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
};

export const chatWithProject = async (req: any, res: any) => {
  try {
    const { table_id } = req.params;
    const { message } = req.body;
    console.log("req.body in chat with pdf===>", req.body);
    console.log("table_id===>", table_id);
    console.log("message===>", message);
    const chat_history = await getChatHistory(table_id);
    console.log("chat_history===>", chat_history);
    const response = await chatWithPdf(table_id, message, chat_history);
    // chat_history = chat_history.concat(response);
    const aiResponseText = response.text;
    await saveChatMessage(table_id, "user", message);
    await saveChatMessage(table_id, "ai", aiResponseText);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getChatHistoryByTableId = async (req: any, res: any) => {
  try {
    const { table_id } = req.params;
    const chatHistory = await prisma.chatMessage.findMany({
      where: {
        tableId: table_id,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    console.log("chat_history===>", chatHistory);
    res.status(200).json({ chatHistory });
  } catch (error) {
    console.log(error);
  }
};
