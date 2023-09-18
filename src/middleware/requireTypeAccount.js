const requireTypeAccount = (...types) => {
  return (req, res, next) => {
    const reqUser = req.user;

    if (!reqUser) {
      return res.status(401).json({
        status: "fail",
        message: "Please log in first to perform the action",
      });
    }

    const type = reqUser.account_type;
    if (!types.includes(type)) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to perform the action",
      });
    }

    next();
  };
};

export default requireTypeAccount;
