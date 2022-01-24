import mongoose from "mongoose";

const fileScheme = mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    sender: { type: Number, required: false },
    receiver: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileScheme);
