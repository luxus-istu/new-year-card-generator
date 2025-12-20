import { useState, useEffect } from 'react';
import Slider from './Slider';
import CardForm from './CardForm';
import type { TemplateMeta } from '@new-year-card-generator/shared';

export default function SigmaSection() {
  const [cardImages, setCardImages] = useState<TemplateMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        setCardImages(data as TemplateMeta[]);
      })
      .catch((error) => {
        console.error("Не удалось загрузить шаблоны:", error);
        setError("Не удалось загрузить шаблоны. Пожалуйста, попробуйте позже.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="sigma">
      <div className="sigma_title">
        <img src="src/client/img/list.png" alt="list" className="list" />
        <h1 className="sigma_name">Волшебство создаётся здесь</h1>
        <img src="src/client/img/list1.png" alt="list" className="list1" />
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
          <Slider templates={cardImages} />
          <CardForm />
        </div>
      )}
    </section>
  );
};
