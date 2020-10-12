const nodemailer = require("nodemailer");

async function sendMail(to, html) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: 'garvnanwani88@gmail.com', // sender address
        to: to, // list of receivers
        subject: "reset password instagraam", // Subject line
        html: html, // html body
    });
}

module.exports = sendMail;



