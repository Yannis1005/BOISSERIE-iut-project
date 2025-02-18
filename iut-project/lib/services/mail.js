'use strict';

const { Service } = require('@hapipal/schmervice');
const Nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

    constructor(server, options) {
        super(server, options);

        this.transporter = Nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            secure: false, // Use STARTTLS
            tls: {
                ciphers: 'SSLv3'
            }
        });
    }

    async sendWelcomeEmail(user) {
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Welcome to Our Awesome Service!',
            text: `Hi ${user.firstName}!\n\nWe're absolutely thrilled to have you join our community. 🎉\n\nAt our service, we strive to provide the best experience possible, and we're here to support you every step of the way.\n\nIf you have any questions or need assistance, don't hesitate to reach out. We're always happy to help!\n\nCheers,\nThe Awesome Team`
        };

        await this.transporter.sendMail(mailOptions);
    }
};