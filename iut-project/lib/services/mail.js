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
            secure: false,
            tls: {
                ciphers: 'SSLv3'
            }
        });
    }

    async sendWelcomeEmail(user) {
        if (!user) {
            console.error('User is undefined', { user});
            return;
        }

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: 'Welcome to Our Awesome Service!',
            html: `
                <p>Hi ${user.firstName}!</p>
                <p>We're absolutely thrilled to have you join our community. 🎉</p>
                <p>At our service, we strive to provide the best experience possible, and we're here to support you every step of the way.</p>
                <p>If you have any questions or need assistance, don't hesitate to reach out. We're always happy to help!</p>
                <p>Cheers,<br>The Awesome Team</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendNewMovieEmail(user, movie) {
        if (!user || !movie) {
            console.error('User or movie is undefined', { user, movie });
            return;
        }

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: `New Movie Alert: ${movie.title}`,
            html: `
            <p>Hi ${user.firstName},</p>
            <p>We're excited to inform you that a new movie titled <strong>${movie.title}</strong> has just been added to our collection! 🎬</p>
            <p>Here are the details:</p>
            <ul>
                <li><strong>Title</strong>: ${movie.title}</li>
                <li><strong>Director</strong>: ${movie.director}</li>
                <li><strong>Genre</strong>: ${movie.genre}</li>
                <li><strong>Description</strong>: ${movie.description}</li>
            </ul>
            <p>Make sure to check it out and let us know your thoughts!</p>
            <p>Happy watching!</p>
            <p>Best regards,<br>The Awesome Team</p>
        `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendMovieUpdateEmail(user, movie) {
        if (!user || !movie) {
            console.error('User or movie is undefined', { user, movie });
            return;
        }

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: `Movie Update: ${movie.title}`,
            html: `
            <p>Hi ${user.firstName},</p>
            <p>We wanted to let you know that the movie <strong>${movie.title}</strong> in your favorites has been updated! 🎬</p>
            <p>Here are the updated details:</p>
            <ul>
                <li><strong>Title</strong>: ${movie.title}</li>
                <li><strong>Director</strong>: ${movie.director}</li>
                <li><strong>Genre</strong>: ${movie.genre}</li>
                <li><strong>Description</strong>: ${movie.description}</li>
            </ul>
            <p>Make sure to check out the updated movie and let us know your thoughts!</p>
            <p>Happy watching!</p>
            <p>Best regards,<br>The Awesome Team</p>
        `
        };

        await this.transporter.sendMail(mailOptions);
    }
};