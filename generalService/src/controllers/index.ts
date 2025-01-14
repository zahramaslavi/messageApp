import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import 'dotenv/config';

export const general = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const usrs = await User.find();

    if (usrs) {
      res.send(usrs);
    } else {
      res.status(404).send("No user found")
    }      
  } catch (error) {
    // Todo: log using morgan
    console.log(`Error while fetching users : ${error}`);
    next(error)
  }
}
