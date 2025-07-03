import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Profile from '../models/profileModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                res.status(401);
                throw new Error('User not found');
            }

            // Attach user to request
            req.user = user;

            // Attach profileId
            if (!user.profile) {
                // Fallback: Try to find profile manually if not linked
                const profile = await Profile.findOne({ user: user._id });
                if (!profile) {
                    res.status(401);
                    throw new Error('No profile found for user');
                }
                req.user.profileId = profile._id;
            } else {
                req.user.profileId = user.profile;
            }

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401);
                throw new Error('Token expired');
            } else {
                res.status(401);
                throw new Error('Not authorized, invalid token');
            }
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token found');
    }
});

export { protect };
