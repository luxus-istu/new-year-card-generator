import { useState, useEffect } from 'react';
import Slider from './Slider';
import CardForm from './CardForm';
import type { Template } from '@/app/types';

export default function SigmaSection() {
  const [cardImages, setCardImages] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTemplate, setCurrentTemplate] = useState<Template>(cardImages[0]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch('/api/templates')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setCardImages(data as Template[]);
        setCurrentTemplate(data[0] as Template);
      })
      .catch((error) => {
        console.error("Не удалось загрузить шаблоны:", error);
        setError("Не удалось загрузить шаблоны. Пожалуйста, попробуйте позже.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onSlideChange = (template: Template) => {
    setCurrentTemplate(template);
  };

  return (
    <section className="sigma">
      <div className="sigma_title">
        <img src="/img/list.png" alt="list" className="list" />
        <h1 className="sigma_name">Волшебство создаётся здесь</h1>
        <img src="/img/list1.png" alt="list" className="list1" />
      </div>
      <h1 className="open_title">Выберите открытку:</h1>

      {isLoading && <div className="loading-message">Загрузка...</div>}

      {error && (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="sigma_items">
          <Slider templates={cardImages} onSlideChange={onSlideChange} />
          <CardForm currentTemplate={currentTemplate} />
        </div>
      )}
    </section>
  );
};
