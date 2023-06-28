import moment from "moment";
import mongoose, { Schema, model, Document } from "mongoose";
import { UserType } from "./User";
export interface ContractType extends Document {
  _id?: string;
  carBrand?: string;
  done?: boolean;
  confirm?: boolean;
  expires?: Date;
  from?: UserType;
  to?: UserType;
  decline?: boolean;
}
const ContractSchema = new Schema(
  {
    carBrand: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    decline: {
      type: Boolean,
      default: false,
    },
    expires: {
      type: Date,
      default: null,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
