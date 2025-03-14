import mongoose, { Document, Model }  from "mongoose";
import { MessageI } from "./message";

export interface UserI extends Document {
  email: string,
  username: string,
  password: string,
  messages: MessageI[]
}

// Define the interface for the User model (including static methods)
interface IUserModel extends Model<UserI> {
  checkEmailAndPassword(email: string, password: string): Promise<UserI>;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<UserI>({
  username: {
    type: String,
    unique: true
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }]
}, {timestamps: true});

const User = mongoose.model<UserI, IUserModel>("user", userSchema)
export default User;