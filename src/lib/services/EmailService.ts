import { Transporter, createTransport } from 'nodemailer';
import type { EmailData, EmailServiceConfig, SendEmailResult, SendMailOptions } from '@/app/types';

export class EmailService {
  private config: EmailServiceConfig;
  private transporter: Transporter;

  constructor(config: EmailServiceConfig) {
    this.config = config;
    this.transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    this.verify();
  }

  private async verify(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ EmailService: SMTP подключение успешно');
    } catch (error) {
      console.error('❌ EmailService: Ошибка SMTP подключения:', error);
    }
  }

  async sendEmail(data: EmailData): Promise<SendEmailResult> {
    try {
      const result = await this.transporter.sendMail({
        from: this.config.from,
        to: data.to,
        subject: "Greeting Card from INPO students!",
        html: data.html,
        text: data.text,
        attachments: data.attachments,
      });

      return {
        success: true,
        message: `Email отправлен: ${result.messageId}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Неизвестная ошибка отправки',
      };
    }
  }

  async sendGreetingCard(options: SendMailOptions): Promise<SendEmailResult> {
    const emailData: EmailData = {
      to: options.to,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Дорогой(ая) ${options.recipient}!</h2>
          <div style="text-align: center; margin: 30px 0;">
            <img src="cid:greeting-card" alt="Поздравительная открытка"
                 style="max-width: 100%; height: auto; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
            <p style="margin-top: 20px; font-size: 16px; color: #666;">
              Шаблон: ${options.templateName}
            </p>
          </div>
          <p style="font-size: 18px; color: #555; text-align: center; line-height: 1.6;">
            Пусть этот день наполнит вашу жизнь радостью, теплом и счастьем! ✨
          </p>
          <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
          <p style="text-align: center; color: #888; font-size: 14px;">
            Отправлено через Greeting Card Generator
          </p>
        </div>
      `,
      attachments: [
        {
          path: options.cardImage,
          cid: 'greeting-card',
        }
      ]
    };

    return this.sendEmail(emailData);
  }

  close(): void {
    this.transporter.close();
  }
}
