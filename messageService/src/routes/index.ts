import { Router } from "express";
import { getUsers } from "../controllers/user";
import { 
    getMessages,
    // getMessage,
    saveMessage,
    // deleteMessage,
    // editMessage
} from "../controllers/message";

const routes = Router();

routes.get("/users", getUsers);

routes.get("/users/:id/messages", getMessages);
// routes.get("users/:id/messsages/:messageId", getMessage);
routes.post("/users/:id/messages", saveMessage);
// routes.delete("/users/:id/messsages/:messageId", deleteMessage);
// routes.put("/users/:id/messsages/:messageId", editMessage);

export default routes;
