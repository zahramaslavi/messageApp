import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const usrs = await User.find().select("-messages").exec();

    if (usrs) {
      res.send([...usrs]);
    } else {
      res.status(404).send("No user found")
    }      
  } catch (error) {
    // Todo: log using morgan
    console.log(`Error while fetching users : ${error}`);
    next(error)
  }
}