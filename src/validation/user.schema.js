import { object, string } from 'yup';
import { account_type, email, name, phone } from './auth.schema.js';

const createNewAdminSchema = object({
  name: name.required(),
  email: email.required(),
  phone: phone.required(),
});

const updateUserByIdSchema = object({
  name: name.required(),
  phone: phone.required(),
  role: string().oneOf(['admin', 'user']).required(),
  account_type: account_type.default('personal'),
});

const updateUserStatusSchema = object({
  status: string().oneOf(['active', 'blocked']).required(),
});

export { createNewAdminSchema, updateUserByIdSchema, updateUserStatusSchema };
