declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_SECURE: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      NEXT_PUBLIC_SMTP_DEFAULT_TO: string;
    }
  }
}

export { };
