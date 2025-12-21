import { useState, ChangeEvent, FormEvent } from 'react';
import type { FormData } from '@/app/types';

export default function CardForm() {
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    recipientName: '',
    recipientEmail: '',
    noEmail: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Make POST requst to server for sending card generated
    /* Example
    fetch('/api/send-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initials, // string
        recipient, // string
        templateId: selectedTemplate.name, // string
        cardImage // base64 image encoded from canvas
        imageType // "image/jpeg" || "image/png"
        email, // string
        })
      })
      .catch((e) => // set error status for user)
      .finally(() => // set ok status for user)
    */
    setFormData({
      senderName: '',
      recipientName: '',
      recipientEmail: '',
      noEmail: false
    });
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="sender-name">Ваше ФИО:</label>
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
        <label htmlFor="recipient-name">ФИО получателя:</label>
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

      <button type="submit" className="form-submit">
        Отправить открытку
      </button>
    </form>
  );
};
