import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import jwt, {Algorithm, SignOptions } from "jsonwebtoken";
import User, { UserI } from "../models/user";
import 'dotenv/config';
import { JWT_EXPIRE_MIN, JWT_EXPIRE_DAY_REFRESH } from "../consts";
import axios from "axios";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

      const {token, refreshToken} = generateJwtToken(payload);

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

    let usr: UserI | null = null;
    if (verifyRes) {
      usr = await User.findOne({refresh_token: refToken}) as UserI;

      if (usr) {
        const options: SignOptions = { 
          algorithm: process.env.JWT_ALGORITHM as Algorithm,
          expiresIn: `${JWT_EXPIRE_MIN}m`
        };

        const payload = {
          "id": usr.id,
          "email": (usr as UserI).email
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

//Todo: create helper functions for github login to be used instead of having this long code
export const githubLoginCallback = async (req: Request, res: Response) => {
  const code = req.params.code;
  try {
    // Step 3: Exchange the code for an access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 4: Use the access token to fetch user details
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    if (githubUser) {
      const payload = {
        "id": githubUser.id,
        "email": githubUser.login + "@github.com"  //Todo: find a way to get email from github or replace with username
      };
  
      const {token, refreshToken} = generateJwtToken(payload);

      let user = await User.findOne({username: githubUser.login});
  
      if (!user) {
        const newUser = new User({
          username: githubUser.login,
          refresh_token: refreshToken
        });
  
        user = await newUser.save();
      } else {
        user.refresh_token = refreshToken;
        await user.save();
      }
  
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: JWT_EXPIRE_MIN * 60 * 1000,
      });

      res.cookie('jwt_refresh', refreshToken, {
        httpOnly: true,
        maxAge: JWT_EXPIRE_DAY_REFRESH * 24 * 60 * 60 * 1000,
      });
  
      res.send({"success": {"user": user}});
    } else {
      res.status(401).send({"error": {"message": "Incorrect username or password"}});
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Authentication failed');
  }
}


const generateJwtToken = (payload: any) => {

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

  return {token, refreshToken};

}



