const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

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
