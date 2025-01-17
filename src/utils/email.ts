import nodemailer from 'nodemailer';
import { convert as htmlToText } from 'html-to-text';
import AppConfig from '../config/app.config';

import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

const poolOptions = {
  pool: true,
  maxConnections: 1,
  maxMessages: 5
};

const smtpOptions = {
  host: AppConfig.sendEmail.EMAIL_HOST,
  port: AppConfig.sendEmail.EMAIL_PORT,
  auth: {
    user: AppConfig.sendEmail.EMAIL_USERNAME,
    pass: AppConfig.sendEmail.EMAIL_PASSWORD
  }
};

export default class Email {
  to: string;
  from: string;

  constructor(emailTo: string) {
    this.to = emailTo;
    this.from = `<${AppConfig.sendEmail.email}>`;
  }

  newTransport() {
    if (AppConfig.NODE_ENV === 'production') {
      // Brevo
      return nodemailer.createTransport({
        host: AppConfig.sendEmail.smtpServer,
        port: AppConfig.sendEmail.smtpPort,
        secure: false,
        auth: {
          user: AppConfig.sendEmail.BREVO_USERNAME,
          pass: AppConfig.sendEmail.BREVO_PASSWORD
        }
      });
    }

    const nodemailerOptions: SMTPTransport.Options = {
      ...poolOptions,
      ...smtpOptions,
      port: parseInt(AppConfig.sendEmail.EMAIL_PORT)
    };

    return nodemailer.createTransport(nodemailerOptions);
  }

  // Send the actual email
  async send(html: string, subject: string) {
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
}
