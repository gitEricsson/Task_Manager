"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const html_to_text_1 = require("html-to-text");
const app_config_1 = __importDefault(require("../config/app.config"));
class Email {
    constructor(emailTo) {
        this.to = emailTo;
        this.from = `<${app_config_1.default.sendEmail.email}>`;
    }
    newTransport() {
        if (app_config_1.default.NODE_ENV === 'production') {
            // Brevo
            return nodemailer_1.default.createTransport({
                host: app_config_1.default.sendEmail.smtpServer,
                port: app_config_1.default.sendEmail.smtpPort,
                secure: false,
                auth: {
                    user: app_config_1.default.sendEmail.BREVO_USERNAME,
                    pass: app_config_1.default.sendEmail.BREVO_PASSWORD
                }
            });
        }
        return nodemailer_1.default.createTransport({
            host: app_config_1.default.sendEmail.EMAIL_HOST,
            port: app_config_1.default.sendEmail.EMAIL_PORT,
            auth: {
                user: app_config_1.default.sendEmail.EMAIL_USERNAME,
                pass: app_config_1.default.sendEmail.EMAIL_PASSWORD
            }
        });
    }
    // Send the actual email
    send(html, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            // 2) Define email options
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject,
                html,
                text: (0, html_to_text_1.convert)(html)
            };
            // 3) Create a transport and send email
            yield this.newTransport().sendMail(mailOptions);
        });
    }
}
exports.default = Email;
