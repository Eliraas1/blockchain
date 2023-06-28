import mongoose, { Schema, model, Document } from "mongoose";
import { JobsType } from "./Jobs";
export interface UserType extends Document {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  img?: string;
  jobs?: JobsType[];
  appliedTo?: JobsType[];
  description?: string;
}
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    img: {
      type: String,
    },
    description: {
      type: String,
    },
    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Jobs",
        required: false,
        default: [],
      },
    ],
    appliedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Jobs",
        required: false,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

// UserSchema.pre("findOne", function (next: any) {
//   this.populate("jobs").populate("appliedTo");
//   next();
// });

export default mongoose.models.User<UserType> ||
  mongoose.model<UserType>("User", UserSchema);
