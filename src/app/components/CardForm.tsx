import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { FormData, Template } from '@/app/types';
import { SmartCaptcha } from "@yandex/smart-captcha";
import "./CardForm.css";

const FALLBACK_RECIPIENT_EMAIL = process.env.NEXT_PUBLIC_SMTP_DEFAULT_TO || '';
const CAPTCHA_SITEKEY = 'ysc1_5h2q8jDd9mUlSsFV2v9OlkUjtqHgnQbzgc5Nj8qa0e91af6c';

type Props = {
  currentTemplate: Template;
};

export default function CardForm({ currentTemplate }: Props) {
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    noEmail: false,
    message: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'noEmail') {
      const isChecked = checked;
      setFormData(prev => ({
        ...prev,
        noEmail: isChecked,
        recipientEmail: isChecked ? FALLBACK_RECIPIENT_EMAIL : prev.recipientEmail,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      setError('Пожалуйста, пройдите проверку "Я не робот"');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/send-card", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: formData.senderName.trim(),
          recipient: formData.recipientName.trim(),
          email: formData.recipientEmail,
          templateId: currentTemplate.name,
          message: formData.message.trim(),
          captchaToken, // ← передаём токен на бэкенд
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Не удалось отправить открытку');
      }

      setSuccess(true);
      setFormData({
        senderName: '',
        recipientName: '',
        recipientEmail: '',
        noEmail: false,
        message: '',
      });
      setCaptchaToken(null); // сбрасываем капчу после успешной отправки
    } catch (err: any) {
      setError(err.message || 'Произошла неожиданная ошибка');
      setCaptchaToken(null); // при ошибке тоже лучше сбросить токен
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = isSubmitting || !captchaToken;

  return (
    <form className="card-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="sender-name">Ваше имя:</label>
        <input
          type="text"
          id="sender-name"
          name="senderName"
          value={formData.senderName}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="recipient-name">Имя получателя:</label>
        <input
          type="text"
          id="recipient-name"
          name="recipientName"
          value={formData.recipientName}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="recipient-email">Почта получателя:</label>
        <input
          type="email"
          id="recipient-email"
          name="recipientEmail"
          value={formData.recipientEmail}
          onChange={handleChange}
          required={!formData.noEmail}
          disabled={formData.noEmail || isSubmitting}
          placeholder={formData.noEmail ? 'Будет отправлено на резервный адрес' : ''}
        />
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            id="no-email"
            name="noEmail"
            checked={formData.noEmail}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <span>Я не знаю почту получателя</span>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="sender-message">Пожелания (необязательно):</label>
        <textarea
          id="sender-message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Напишите своё пожелание..."
        />
      </div>

      <div className="form-group captcha-group">
        <SmartCaptcha
          sitekey={CAPTCHA_SITEKEY}
          language="ru"
          onSuccess={handleCaptchaSuccess}
          onChallengeHidden={handleCaptchaExpire}
        />
      </div>

      <button
        type="submit"
        className="form-submit"
        disabled={isSubmitDisabled}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить открытку'}
      </button>

      {error && <p className="error-message" role="alert">{error}</p>}
      {success && (
        <p className="success-message" role="status">
          Открытка успешно отправлена!
        </p>
      )}
    </form>
  );
}
