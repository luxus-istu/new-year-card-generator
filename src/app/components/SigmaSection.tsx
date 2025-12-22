import { useState, useEffect } from 'react';
import Slider from './Slider';
import CardForm from './CardForm';
import type { Template } from '@/app/types';
import './SigmaSection.css'; // Обычный импорт без module

export default function SigmaSection() {
  const [cardImages, setCardImages] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTemplate, setCurrentTemplate] = useState<Template | undefined>(undefined);

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
        const templates = data as Template[];
        setCardImages(templates);
        setCurrentTemplate(templates[0]);
      })
      .catch((error) => {
        console.error('Не удалось загрузить шаблоны:', error);
        setError('Не удалось загрузить шаблоны. Пожалуйста, попробуйте позже.');
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
      {/* Заголовок */}
      <div className="sigma_title">
        <img src="/img/list.png" alt="Декоративный элемент" className="list" />
        <h1 className="sigma_name">Волшебство создаётся здесь</h1>
        <img src="/img/list1.png" alt="Декоративный элемент" className="list1" />
      </div>

      <h2 className="open_title">Выберите открытку:</h2>

      {/* Сообщения */}
      {isLoading && <div className="loading_message">Загрузка...</div>}

      {error && <div className="error_message">{error}</div>}

      {/* Основной контент */}
      {!isLoading && !error && cardImages.length > 0 && (
        <div className="sigma_items">
          <div className="sigma_items_inner">
            <Slider templates={cardImages} onSlideChange={onSlideChange} />
            {currentTemplate && <CardForm currentTemplate={currentTemplate} />}
          </div>
        </div>
      )}
    </section>
  );
}
