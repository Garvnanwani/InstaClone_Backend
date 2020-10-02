const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Please enter your username"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password should be atleast minimum of 6 characters"],
        maxlength: [12, "Password should be maximum of 12 characters"],
    },
    avatar: {
        type: String,
        default:
            "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png",
    },
    bio: {
        type: String
    },
    website: {
        type: String
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followersCount: {
        type: Number,
        default: 0,
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followingCount: {
        type: Number,
        default: 0,
    },
    posts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
    postCount: {
        type: Number,
        default: 0,
    },
    savedPosts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", UserSchema);
