import { object, string } from "yup";

export const candidateSchema = object({
  note: string().max(1000).required(),
  file: string().max(500).required(),
  fileName: string(),
});

export const statusOfApplication = object({
  status: string().oneOf(["confirmed", "rejected"], "Status ERROR").required(),
});
