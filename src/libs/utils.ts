import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getChatHistory = async (tableId: string) => {
  const chatHistory = await prisma.chatMessage.findMany({
    where: {
      tableId: tableId,
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return chatHistory.map((message) => {
    return message.sender === "user"
      ? new HumanMessage(message.message)
      : new AIMessage(message.message);
  });
};

export const saveChatMessage = async (
  tableId: string,
  sender: "user" | "ai",
  message: string
) => {
  await prisma.chatMessage.create({
    data: {
      tableId,
      sender,
      message,
      timestamp: new Date(),
    },
  });
};
