let UserModel = require("../models/user");
var passport = require("../services/passportconf");
var jwt = require('jsonwebtoken');
var config = require('config');
const { body, validationResult } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;


let userlogin = [
    // Định nghĩa các quy tắc kiểm tra
    body('emailid', 'Invalid email address').isEmail().notEmpty(),
    body('password', 'Invalid password').isLength({ min: 5, max: 16 }),

    // Middleware xử lý request
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: 'Invalid inputs',
                errors: errors.array()
            });
        }
        passport.authenticate('login', { session: false }, (err, user, info) => {
            console.log("authenticate " + err);

            if (err || !user) {
                return res.json(info);
            }

            req.login({ _id: user._id }, { session: false }, (err) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Server Error"
                    });
                }
                console.log("secret " + config.get('jwt.secret'));

                var token = jwt.sign({ _id: user._id }, config.get('jwt.secret'), { expiresIn: 5000000 });
                console.log("token " + token);
                res.json({
                    success: true,
                    message: "login successful",
                    user: {
                        name: user.name,
                        type: user.type,
                        _id: user._id,
                        emailid: user.emailid,
                        contact: user.contact
                    },
                    token: token
                });
            });
        })(req, res, next);
    }
];

module.exports = { userlogin };

