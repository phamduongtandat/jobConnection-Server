import { object, date, string, number } from "yup";

export const title = string().max(100);
export const deadlineDate = date().min(new Date());
export const field = string().max(100);
export const salary = string().max(100);
export const workLocation = string().max(300);
export const position = string().max(300);
export const numberApplicants = number().min(0).max(100);
export const description = string().max(5000);

export const createJobSchema = object({
  title: title.required(),
  deadlineDate: deadlineDate.required(),
  field: field.required(),
  salary: salary.required(),
  workLocation: workLocation.required(),
  position: position.required(),
  numberApplicants: numberApplicants.required(),
  description: description.required(),
});

export const updateJobSchema = object({
  title: title,
  deadlineDate: deadlineDate,
  field: field,
  salary: salary,
  workLocation: workLocation,
  position: position,
  numberApplicants: numberApplicants,
  description: description,
});
