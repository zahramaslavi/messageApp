import { Router } from "express";
import { login, register, logout, refreshTok } from "../controllers";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const routes = Router();

routes.post("/login", login);
routes.post("/register", register);
routes.post("/logout", logout);
routes.post("/token", refreshTok);


const publicKeyPath = path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY_PATH as string);
let publicKey = fs.readFileSync(publicKeyPath, "utf8");

routes.get("/hi",async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies["jwt"];
    console.log(token)
    if (token) {
      const decoded = await jwt.verify(token, publicKey);
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
    console.log(err)
    next(err);
  }
}, (req: any, res: any) => {
  console.log("hi")
  res.send("hi")
});

export default routes;
