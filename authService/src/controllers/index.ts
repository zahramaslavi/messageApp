import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import jwt, {Algorithm, SignOptions } from "jsonwebtoken";
import User from "../models/user";
import 'dotenv/config';
import { JWT_EXPIRE_MIN, JWT_EXPIRE_DAY_REFRESH } from "../consts";

const privateKeyPath = path.resolve(process.cwd(), process.env.JWT_PRIVATE_KEY_PATH as string);
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const publicKeyPath = path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY_PATH as string);
let publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const usr = await User.checkEmailAndPassword(email, password)

    if (usr) {
      const payload = {
        "id": usr.id,
        "email": usr.email
      };

      const options: SignOptions = { 
        algorithm: process.env.JWT_ALGORITHM as Algorithm,
        expiresIn: `${JWT_EXPIRE_MIN}m`
      };
      const token = jwt.sign(payload, privateKey, options);

      const optionsRefresh: SignOptions = { 
        algorithm: process.env.JWT_ALGORITHM as Algorithm,
        expiresIn: `${JWT_EXPIRE_DAY_REFRESH}d`
      };
      const refreshToken = jwt.sign(payload, privateKey, optionsRefresh);

      usr.refresh_token = refreshToken;
      await usr.save();

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: JWT_EXPIRE_MIN * 60 * 1000, 
      });
      res.cookie('jwt_refresh', refreshToken, {
        httpOnly: true,
        maxAge: JWT_EXPIRE_DAY_REFRESH * 24 * 60 * 60 * 1000, 
      });
      res.send({"success": {"user": usr}});
    } else {
      res.status(401).send({"error": {"message": "Incorrect username or password"}});
    }      
  } catch (error) {
    // Todo: log using morgan
    next(error)
    console.log(`Error while login : ${error}`);
  }
}

// Todo: handle if already registered
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
      const user = new User(req.body);

      if (user) {
        const savedUser = await user.save();

        res.send({"success": {"user": savedUser}});
      } else {
        res.status(400).send({"error": {"message": "Error creating your account"}});
      }
    } else {
      res.status(409).send({"error": {"message": "User with this email already exists"}});
    }
      
  } catch (error) {
    //Todo: log using morgan
    console.log("Error registering user: ", error);
    next(error)
  }
}

export const refreshTok = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refToken = req.cookies["jwt_refresh"];
    const verifyRes = jwt.verify(refToken, publicKey);

    if (verifyRes) {
      const usr = await User.findOne({refresh_token: refToken});

      if (usr) {
        const options: SignOptions = { 
          algorithm: process.env.JWT_ALGORITHM as Algorithm,
          expiresIn: `${JWT_EXPIRE_MIN}m`
        };

        const payload = {
          "id": usr.id,
          "email": usr.email
        };

        const token = jwt.sign(payload, privateKey, options);

        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: JWT_EXPIRE_MIN * 60 * 1000, 
        });
        res.send({"success": "Refreshed token successfully"});
      } else {
        res.status(403).send({"error": {"message": "Refresh token is not valid"}});
      }
    } else {
      res.status(403).send({"error": {"message": "Refresh token is not valid"}});
    }
    
  } catch (error) {
    console.log("Error refreshing token: ", error);
    next(error);
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("jwt_refresh");

    res.send({"success": {"message": "Successful logout"}});
  } catch (error) {
    //Todo: log using morgan
    console.log("Error loging out: ", error);
    next(error);
  }
}

