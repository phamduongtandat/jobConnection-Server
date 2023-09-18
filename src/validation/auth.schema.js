import { array, object, ref, string } from 'yup';

// ============ schema properties

export const email = string().email().max(100).required();
export const phone = string().matches(
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
  'Please provide valid phone number',
);

export const name = string().max(100);
export const address = string().max(200);
export const fields = array().of(string().length(24).required());
export const overview = string().max(1000);
export const account_type = string().oneOf(['personal', 'business']).required();

export const password = string()
  .matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{4,}$/,
    'password should contain at least 1 uppercase, 1 lowercase, 1 number & 1 special character (@$!%*?&)  ',
  )
  .min(8, 'password need to be at least 8 character')
  .max(100)
  .required();

// ============= schemas
const registerUserSchema = object({
  email,
  password,
  confirmPassword: string()
    .oneOf([ref('password')], 'password are not the same')
    .label('confirm password'),
  account_type,
});

const signInSchema = object({
  email,
  password: string().min(8, 'password should be at least 8 characters'),
});

const updateCurrentUserSchema = object({
  name,
  phone,
  address,
  fields,
  overview,
});

const updatePasswordSchema = object({
  oldPassword: string().min(8).max(100),
  newPassword: password,
  newPasswordConfirm: string()
    .oneOf([ref('newPassword')], 'new password confirm is not correct')
    .required(),
});

const createResetPasswordTokenSchema = object({
  email,
});

const resetPasswordWithTokenSchema = object({
  newPassword: password.label('new password'),
  confirmPassword: string()
    .oneOf([ref('newPassword')], 'password are not the same')
    .required(),
});

export {
  createResetPasswordTokenSchema,
  registerUserSchema,
  resetPasswordWithTokenSchema,
  signInSchema,
  updateCurrentUserSchema,
  updatePasswordSchema,
};
