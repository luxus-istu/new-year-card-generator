import { useState, ChangeEvent, FormEvent } from 'react';
import type { FormData, Template } from '@/app/types';

const FALLBACK_RECIPIENT_EMAIL = process.env.NEXT_PUBLIC_SMTP_DEFAULT_TO || '';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    if (name === 'noEmail') {
      setFormData(prev => ({
        ...prev,
        noEmail: checked,
        recipientEmail: checked ? FALLBACK_RECIPIENT_EMAIL : '',
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/send-card", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: formData.senderName,
          recipient: formData.recipientName,
          email: formData.recipientEmail,
          templateId: currentTemplate.name,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send card');
      }

      setSuccess(true);
      setFormData({
        senderName: '',
        recipientName: '',
        recipientEmail: '',
        noEmail: false,
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="sender-name">Ваше Имя:</label>
        <input
          type="text"
          id="sender-name"
          name="senderName"
          value={formData.senderName}
          onChange={handleChange}
          required
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
          disabled={formData.noEmail}
        />
      </div>
      <div className="form-group">
        <label htmlFor="sender-message">Пожелания (необязательное поле)</label>
        <input
          type="text"
          id="sender-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            id="no-email"
            name="noEmail"
            checked={formData.noEmail}
            onChange={handleChange}
          />
          <span>Я не знаю почту получателя</span>
        </label>
      </div>
      <button type="submit" className="form-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Отправить открытку'}
      </button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Открытка успешно отправлена!</p>}
    </form>
  );
}
