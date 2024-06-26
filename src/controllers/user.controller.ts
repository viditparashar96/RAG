import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/dbclient";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json("Please fill all fields");
    }

    const userfound = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userfound) {
      return res.status(400).json("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json(createdUser);
    prisma.$disconnect();
  } catch (error) {
    console.log(error);

    prisma.$disconnect();
    return res.status(500).json("Internal Server Error");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: any = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json("User not found");
    }
    const validPassword = await bcrypt.compare(password, user.password!);
    if (!validPassword) {
      return res.status(400).json("Invalid Password");
    }
    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login Successful",
      token: token,
    });
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
  }
};

export const currentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("current user==>", req.user);
    res.status(200).json({
      user: req.user,
    });
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
  }
};
