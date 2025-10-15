const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or your preferred email service
            auth: {
                user: process.env.EMAIL_USER, // Your email from .env
                pass: process.env.EMAIL_PASS, // Your email password from .env
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: text, // Using html for better formatting
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        // We don't want to throw an error here to not break the main flow
    }
};

module.exports = sendEmail;
