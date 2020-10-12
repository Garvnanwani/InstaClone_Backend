const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const sendMail = require('../services/emailSend')
const crypto = require('crypto');
const bcrypt = require("bcryptjs");


exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // both fields should be filled
    if (!email || !password) {
        return next({
            message: "Please enter both email and password",
            statusCode: 400,
        })
    }

    // check if user already exists
    const user = await User.findOne({ email });

    if (!user) {
        return next({
            message: "Email not registered",
            statusCode: 400,
        })
    }

    // checking password
    const match = await user.checkPassword(password);

    if (!match) {
        return next({ message: "The password does not match", statusCode: 400 });
    }
    const token = user.getJwtToken();

    // send json web token as response
    res.status(200).json({ success: true, token });
});


exports.signup = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    const user = await User.create({ username, email, password });

    const token = user.getJwtToken();

    res.status(200).json({ success: true, token });

})

exports.userprofile = asyncHandler(async (req, res, next) => {
    const { avatar, username, fullname, email, _id, website, bio } = req.user;

    res
        .status(200)
        .json({
            success: true,
            data: { avatar, username, fullname, email, _id, website, bio },
        });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
        }

        const token = buffer.toString("hex")

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return next({
                message: "Email not registered",
                statusCode: 400,
            })
        }

        user.resetToken = token;
        user.expireToken = Date.now() + 3600000

        console.log(user.password)

        try {

            const saveUser = await user.save(); //when fail its goes to catch

            sendMail(email, `<p>You requested for password change</p><h5>click on this <a href="https://instagraam.netlify.app/reset-password/${token}"> link </a> to reset your password</h5>`).then(() => {
                res.json({ message: "check your email for the link" })
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ error: 'Error in email sending.' });
            });

        } catch (err) {
            console.log('err: ' + err);
            res.status(500).send(err);
        }

    })
})

exports.newPassword = asyncHandler(async (req, res, next) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    const user = await User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })

    if (!user) {
        return next({
            message: "Expired Link or Invalid User",
            statusCode: 400,
        })
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.password = newPassword;

    try {

        const saveUser = await user.save(); //when fail its goes to catch
        res.status(200).json({ success: true, message: "Changed Password Successfully" });

    } catch (err) {
        console.log('err: ' + err);
        res.status(500).send(err);
    }


})
