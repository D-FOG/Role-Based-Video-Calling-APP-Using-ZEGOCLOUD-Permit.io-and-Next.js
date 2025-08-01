import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "viewer" }, // or "admin"
  firstName: { type: String },
  lastName: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
