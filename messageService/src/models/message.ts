import mongoose, { Model } from "mongoose";
import { UserI } from "./user";

export interface MessageI {
  id: string,
  text: string,
  sender: UserI,
  receiver: UserI,
  createdAt: Date
}

interface MessageModelI extends Model<MessageI> {}

const Schema = mongoose.Schema;

const messageSchema = new Schema<MessageI>({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model<MessageI, MessageModelI>("Message", messageSchema);
export default Message;