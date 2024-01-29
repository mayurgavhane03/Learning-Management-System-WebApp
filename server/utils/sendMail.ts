import dotenv from 'dotenv';
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        service: process.env.SMTP_SERVICE || '',
        auth: {
            user: process.env.SMTP_MAIL || '',
            pass: process.env.SMTP_PASSWORD || '',
        },
    });
};

const sendMail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter: Transporter = createTransporter();

        const { email, subject, template, data } = options;

        const templatePath = path.join(__dirname, '../mails', template);

        // Render the email template with ejs
        const html: string = await ejs.renderFile(templatePath, data);

        // Log the activationCode for debugging
        console.log('Activation Code:', data.activationCode);

        const mailOptions = {
            from: process.env.SMTP_MAIL || 'your-email@example.com',
            to: email,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};

export default sendMail;
