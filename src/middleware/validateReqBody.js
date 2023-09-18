const validateReqBody = (schema) => {
  return async (req, res, next) => {
    try {
      const body = await schema.validate(req.body, {
        stripUnknown: true,
        abortEarly: false,
      });

      req.body = body;
      return next();
    } catch (err) {
      let error = err;
      const { errors } = error;

      return res.status(400).json({
        status: 'fail',
        message: 'Data validation failed',
        errors: errors,
      });
    }
  };
};

export default validateReqBody;
