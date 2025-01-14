import { Router } from "express";
import { general } from "../controllers";
import jwt from "jsonwebtoken";

const routes = Router();

routes.get("/general", general);

export default routes;
