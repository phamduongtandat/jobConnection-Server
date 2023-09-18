import { isAfter } from 'date-fns';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const checkUserID = () => {
    return async (req, res, next) => {
        const cookie = req.cookies?.jwt;

        if (!cookie) {
            return next()
        }

        const jwtSecret = process.env.JWT_SECRET;

        try {
            const payload = jwt.verify(cookie, jwtSecret);

            const user = await User.findById(payload._id).select(
                '_id'
            );

            //   if (!user) {
            //     return res.status(404).json({
            //       status: 'fail',
            //       message: 'User with provided token no longer exist',
            //     });
            //   }

            //   if (
            //     user.passwordChangedAt &&
            //     isAfter(new Date(user.passwordChangedAt), new Date(payload.iat * 1000))
            //   ) {
            //     return res.status(400).json({
            //       status: 'fail',
            //       message: 'You recently changed your password. Try to login again.',
            //     });
            //   }

            req.userID = user;
            next();
        } catch (err) {
            res.status(401).json({
                status: 'fail',
                message: 'Your token is expired or invalid',
            });
        }
    };
};

export default checkUserID;
