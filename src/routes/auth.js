const express = require('express');
const router = express.Router();
const { login, signup, userprofile } = require('../controllers/auth');
const protect = require('../middleware/auth');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/userprofile").get(protect, userprofile);

module.exports = router;
