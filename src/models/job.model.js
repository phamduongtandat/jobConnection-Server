import mongoose from "mongoose";
import { string } from "yup";
const candidateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: mongoose.Schema.Types.String,
      ref: "user",
      //required: true,
    },
    status: {
      type: String,
      enum: ["awaiting", "confirmed", "rejected"],
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      //required: true
    },
  },
  {
    timestamps: true,
  }
);
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    deadlineDate: {
      type: Date,
      required: true,
    },
    field: {
      type: mongoose.Schema.Types.String,
      ref: "field",
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    workLocation: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    numberApplicants: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["opened", "closed", "outofdated", "extended", "removed"],
      required: true,
    },
    removalReason: {
      type: String,
    },
    candidateList: {
      type: [candidateSchema],
    },
  },
  {
    timestamps: true,
  }
);
const Job = mongoose.model("job", jobSchema);

export { Job };
