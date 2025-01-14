import mongoose, { Document, Model }  from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

interface IUser extends Document {
  email: string;
  password: string;
}

// Define the interface for the User model (including static methods)
interface IUserModel extends Model<IUser> {
  checkEmailAndPassword(email: string, password: string): Promise<IUser>;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"]
  }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.checkEmailAndPassword = async function(email: String, password: String) {
  const usr = await this.findOne({email});
  if (usr) {
    const auth: Boolean = await bcrypt.compare(password as string, usr.password);

    if (auth) {
      return usr;
    }

    throw Error("Invalid password");
  }

  throw Error("Email does not exists");
}

const User = mongoose.model<IUser, IUserModel>("user", userSchema)
export default User;