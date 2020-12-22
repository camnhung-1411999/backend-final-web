import { Injectable } from '@nestjs/common';
import * as Email from 'email-templates';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

@Injectable()
export class Mailer {
    async send(data: any, url: string): Promise<void> {
        const transporter: any = await nodemailer.createTransport({
          pool: true,
            service: 'Gmail',
            auth: {
              user: process.env.HOST_MAIL,
              pass: process.env.PASS_MAIL,
            },
        });
        const email = new Email({
          message: {
            from: process.env.HOST_MAIL,
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
        } catch (error) {
            console.log(error)
        }
      }
    
}