const requireRole = (...roles) => {
  return (req, res, next) => {
    const reqUser = req.user;

    if (!reqUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please log in first to perform the action',
      });
    }

    const role = reqUser.role;

    if (!roles.includes(role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to perform the action action',
      });
    }

    next();
  };
};

export default requireRole;
