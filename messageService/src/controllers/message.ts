import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Message from "../models/message";

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("messages");

    if (user) {
      res.send(user.messages);
    } else {
      res.status(404).send("No user found");
    }      
  } catch (error) {
    // Todo: log using morgan
    console.log(`Error while fetching messages of user with id ${id} : ${error}`);
    next(error)
  }
}

export const saveMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { text, receiverId } = req.body;  

  try {
    const sender = await User.findById(id).exec();
    const receiver = await User.findById(receiverId).exec();

    if (!sender) {
      res.status(404).json({ message: "Sender not found" });
    } else if (!receiver) {
      res.status(404).json({ message: "receiver not found" });
    } else {
      const message = await Message.create({text, sender: id, receiver: receiverId});

      sender.messages.push(message.id);
      await sender.save();

      receiver.messages.push(message.id);
      await receiver.save();

      res.send(message);
    }
  } catch (error) {
    console.log(`Error while saving message : ${error}`);
    next(error);
  }
}

// export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
    
//   } catch (error) {
//     console.log(`Error while deleting message : ${error}`);
//     next(error);
//   }
// }

// export const editMessage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
    
//   } catch (error) {
//     console.log(`Error while editing message : ${error}`);
//     next(error);
//   }
// }

// export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
    
    
//   } catch (error) {
//     console.log(`Error while fetching message : ${error}`);
//     next(error);
//   }
// }