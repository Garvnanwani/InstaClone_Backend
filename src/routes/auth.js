const express = require('express');
const router = express.Router();
const { login, signup, userprofile, resetPassword, newPassword } = require('../controllers/auth');
const protect = require('../middlewares/auth');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/userprofile").get(protect, userprofile);
router.route("/reset-password").post(resetPassword);
router.route("/new-password").post(newPassword);

module.exports = router;
