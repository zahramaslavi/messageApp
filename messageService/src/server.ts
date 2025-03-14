import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { verifyAuth } from "./middleware";


const mongoUrl = process.env.MONGO_URL;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(verifyAuth);

app.use(bodyParser.json());

app.use("/", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send();
});

let server: any = null;

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

export const startServer = async () => {
  try {
    //Connect to mongoose 
    mongoose.connect(mongoUrl as string)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: any) => console.error("Error connecting to MongoDB:", err));


    server = app.listen(3002);
    console.log("Listening on port 3001!--");

    return server;
      
  } catch (error) {
    console.log("An error happened: ", error);        
  }
}

export const closeServer = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed")
    }

    if (server) {
      server.close(() => {
        console.log("Server closed.");
      });
    }
  } catch (error) {
    console.error("Error closing server:", error);
  }
};

// Triggering close on a specific condition (e.g., app termination)
process.on('SIGINT', async () => {
  console.log("SIGINT received. Closing MongoDB connection...");
  await closeServer();
  process.exit(0);
});

export default app;