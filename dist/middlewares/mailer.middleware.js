"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const common_1 = require("@nestjs/common");
const Email = require("email-templates");
const path = require("path");
const nodemailer = require("nodemailer");
let Mailer = class Mailer {
    async send(data, url) {
        const transporter = await nodemailer.createTransport({
            pool: true,
            service: 'Gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.HOST_MAIL || 'camnhung111777@gmail.com',
                pass: process.env.PASS_MAIL || 'swxajgfvfvzvtesu',
            },
        });
        const email = new Email({
            message: {
                from: process.env.HOST_MAIL || 'camnhung111777@gmail.com',
            },
            send: true,
            transport: transporter,
        });
        try {
            const mail2 = await email.send({
                template: path.join(__dirname, url),
                message: {
                    to: data.user,
                },
                locals: {
                    data,
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
};
Mailer = __decorate([
    common_1.Injectable()
], Mailer);
exports.Mailer = Mailer;
//# sourceMappingURL=mailer.middleware.js.map