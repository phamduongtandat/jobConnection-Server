const handleUniqueFieldError = (error) => {
  const duplicateField = Object.keys(error.keyValue)[0];
  return `${duplicateField} already existed`;
};

const globalErrorHandler = (error, req, res, next) => {
  let message = 'Something wentwrong';
  let statusCode = 400;

  // invalid jsonwebtoken
  if (error.message === 'jwt malformed') message = 'The token is not valid';

  // expired jwt
  if (error.message === 'jwt expired') message = 'The token is expired';

  // email must be unique
  if (error.code === 11000) {
    message = handleUniqueFieldError(error);
  }

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    message = `${error.value} is not a valid objectId`;
  }

  if (message === 'Something wentwrong') {
    console.log(error.name);
    console.log(error.message);
  }

  res.status(statusCode).json({
    status: 'fail',
    message,
  });
};

export default globalErrorHandler;
