import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "./User";
export type JobSubType = "Full time" | "Student" | "Part time";
export interface JobsType extends Document {
  _id?: string;
  user?: UserType;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  subCategory?: string;
  type?: JobSubType;
  createdAt?: Date;
  updatedAt?: Date;
  appliedUsers?: UserType[];
}
const JobsSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appliedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        default: [],
      },
    ],
    location: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
    },
    type: {
      type: String,
      default: "Full time",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Jobs<JobsType> ||
  mongoose.model<JobsType>("Jobs", JobsSchema);
