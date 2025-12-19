import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FormData } from '../../types/client';

const CardForm: React.FC = () => {
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
    // Здесь будет логика отправки формы
    alert('Открытка отправлена!');
    // Сброс формы
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

export default CardForm;