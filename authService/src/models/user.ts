import mongoose, { Document, Model }  from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

export interface UserI extends Document {
  id: string,
  email: string,
  username: string,
  password: string,
  refresh_token?: string,
}

// Define the interface for the User model (including static methods)
interface UserModelI extends Model<UserI> {
  checkEmailAndPassword(email: string, password: string): Promise<UserI>;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<UserI>({
  email: {
    type: String,
    // required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  username: { 
    type: String,
    unique: true
  },
  password: {
    type: String,
    // required: [true, "Please enter a password"]
  },
  refresh_token: {
    type: String,
    required: [false]
  }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
  if (this.email && !this.username) {
    this.username = this.email.split("@")[0];
  }

  if (!this.email && this.username) {
    this.email = `${this.username}@tempEmail.com`;
  }

  if (this.isModified('password')) { 
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.statics.checkEmailAndPassword = async function(email: string, password: string) {
  const usr = await this.findOne({email});
  if (usr) {
    const auth: Boolean = await bcrypt.compare(password as string, usr.password);
    if (auth) {
      return usr;
    }
  }

  return null;
}

const User = mongoose.model<UserI, UserModelI>("User", userSchema)
export default User;