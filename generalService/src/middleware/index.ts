import { Request, Response, NextFunction } from "express";
import jwt, {Algorithm, SignOptions} from "jsonwebtoken";
import fs from "fs";
import path from "path";

const publicKeyPath = path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY_PATH as string);
let publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["jwt"];
    console.log(token)
    if (token) {
      const options: SignOptions = { algorithm: process.env.JWT_ALGORITHM as Algorithm };
      const decoded = await jwt.verify(token, publicKey, options);
      console.log(decoded)
      if (decoded) {
        next();
      } else {
        res.status(401).send("Your token is not acceptable!");
      }
    } else {
      res.status(401).send("You are not loged in!");
    }
  } catch(err) {
    next(err);
  }
}