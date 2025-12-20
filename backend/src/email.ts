import { EmailService } from "./services/EmailService.js";

const config = {
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE! === "true",
  username: process.env.SMTP_USERNAME!,
  password: process.env.SMTP_PASSWORD!,
  from: process.env.SMTP_FROM!
};


export const emailService = new EmailService(config);
