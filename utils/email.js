import nodemailer from 'nodemailer';
import pug from 'pug';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendEmail = async (options) =>
{
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth:
            {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        }
    )


    const html = pug.renderFile(join(__dirname, '../views/emails', `${options.template}.pug`), 
    {
        firstName: options.user.name.split(' ')[0],
        url: options.url,
        subject: options.subject
    });
    const mailOptions = 
    {
        from: `Natours Admin <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: html,
        text: 'Please view this email in an HTML client'
    }

    await transporter.sendMail(mailOptions);
}