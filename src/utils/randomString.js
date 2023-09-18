import crypto from 'crypto';

const randomString = (length = 24) => {
  return crypto.randomBytes(24).toString('hex').slice(0, length);
};

export default randomString;
