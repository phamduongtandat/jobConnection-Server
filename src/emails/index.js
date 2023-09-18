import { sendEmail } from '../config/email.js';

const sendResetPasswordToken = async ({ token, email, name }) => {
  const reset_password_link = `${process.env.CLIENT_HOST}?resetPasswordToken=${token}`;

  await sendEmail({
    fileName: 'reset-password.mjml',
    payload: {
      reset_password_link,
      name: name || email,
    },
    subject: 'Bạn đã yêu cầu đổi mật khẩu',
    to: email,
  });
};

// send email when admin create new user
const sendNewUserCredentials = async ({ email, password, name }) => {
  await sendEmail({
    fileName: 'new-admin-credential.mjml',
    payload: {
      name: name || email,
      email,
      password,
      login_link: process.env.CLIENT_HOST,
    },
    subject: 'Bạn đã được thêm làm quản trị viên tại vjobs',
    to: email,
  });
};

export { sendNewUserCredentials, sendResetPasswordToken };
