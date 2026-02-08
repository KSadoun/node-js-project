const nodemailer = require('nodemailer');
const fs = require('fs/promises');
const path = require('path');


// Create transporter with your SMTP service
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports like 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


const attachTemplateVariables = (htmlTemplate, variables = {}) => {
    let html = htmlTemplate;

    for (const key in variables) {
        if (variables.hasOwnProperty(key)) {
            html = html.replace(new RegExp(`\\\${${key}}`, 'g'), variables[key]);
        }
    }

    return html;
}

const sendWelcomeEmail = async (user) => {
    try {

        const subject = "Welcome";
        const text = "Text Message";
        const to = user.email;

        const templatePath = path.join(__dirname, '../templates/emails/welcome.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        const html = attachTemplateVariables(htmlTemplate, { email: user.email });

        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text: text || 'Check HTML for content',
            html
        });

        console.log('✓ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
};

const sendPasswordResetEmail = async (user, resetToken) => {
    try {

        const subject = "Password Reset Link";
        const text = "Reset Your Password";
        const to = user.email;

        const templatePath = path.join(__dirname, '../templates/emails/passwordReset.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        const html = attachTemplateVariables(htmlTemplate, { email: user.email, resetToken: resetToken, websiteUrl: process.env.WEBSITE_URL });


        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text: text || 'Check HTML for content',
            html
        });

        console.log('✓ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}

const sendPasswordResetConfirmation = async (user) => {
    try {

        const subject = "Password Reset Confirmation";
        const text = "Reset Your Password";
        const to = user.email;

        const templatePath = path.join(__dirname, '../templates/emails/passwordResetConfirmation.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        const html = attachTemplateVariables(htmlTemplate, { email: user.email });

        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text: text || 'Check HTML for content',
            html
        });

        console.log('✓ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}


const sendCommentNotification = async (postAuthor, commenter, post, comment) => {
    try {

        const subject = `New Comment on your Post: ${ post }`;
        const text = "Reset Your Password";
        const to = postAuthor.email;

        const templatePath = path.join(__dirname, '../templates/emails/commentNotification.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        console.log(postAuthor.name)

        const html = attachTemplateVariables(htmlTemplate, { name: postAuthor.name, commenter: commenter.name, post: post, comment: comment });

        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text: text || 'Check HTML for content',
            html
        });

        console.log('✓ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
} 



const sendReplyNotification = async (commentAuthor, replier, comment, reply) => {
    try {

        const subject = `New Reply on your Comment: ${ comment }`;
        const text = "Reset Your Password";
        const to = commentAuthor.email;

        const templatePath = path.join(__dirname, '../templates/emails/replyNotification.html');
        let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

        const html = attachTemplateVariables(htmlTemplate, {
            name: commentAuthor.name,
            replier: replier,
            comment: comment,
            reply: reply
        });


        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text: text || 'Check HTML for content',
            html
        });

        console.log('✓ Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetConfirmation, sendCommentNotification, sendReplyNotification };
