import { Attachment } from 'nodemailer/lib/mailer';

export interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from: string;
}

export interface EmailData {
  to: string;
  html: string;
  text?: string;
  attachments?: Attachment[];
}

export interface SendEmailResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SendMailOptions {
  to: string;
  recipient: string;
  templateName: string;
  cardImage: Buffer;
}
