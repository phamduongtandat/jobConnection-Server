import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      set: (value) => value.toLowerCase(),
      get: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    creator: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Field = mongoose.model("Field", fieldSchema);
export { Field };
