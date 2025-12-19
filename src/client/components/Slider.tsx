import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IndicatorPosition} from '../../types/client';
import { TemplateMeta } from '../../types';

interface ImagesProps {
  templates: TemplateMeta[]
}

const Slider: React.FC<ImagesProps> = ({templates}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const centerIndicatorRef = useRef<HTMLDivElement>(null);
  
  const totalSlides: number = templates.length;

  // Добавим проверку на пустой массив
  useEffect(() => {
    if (templates.length === 0) {
      console.warn('Slider: templates array is empty');
    }
  }, [templates]);

  const goToSlide = useCallback((index: number): void => {
    if (isAnimating || templates.length === 0) return;
    
    // Зацикливание
    let newIndex = index;
    if (index < 0) {
      newIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      newIndex = 0;
    }

    setIsAnimating(true);
    setCurrentIndex(newIndex);

    // Скроллим
    if (slidesContainerRef.current) {
      slidesContainerRef.current.scrollTo({
        left: slidesContainerRef.current.clientWidth * newIndex,
        behavior: 'smooth'
      });
    }

    // Анимация звезды
    if (centerIndicatorRef.current) {
      const centerEl = centerIndicatorRef.current;
      centerEl.classList.remove('animate');
      void centerEl.offsetWidth; // Принудительный reflow
      centerEl.classList.add('animate');
    }

    // Снимаем флаг анимации
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, totalSlides, templates.length]);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isAnimating || templates.length === 0) return;
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating, goToSlide, templates.length]);

  // Показываем/скрываем индикаторы
  const shouldShowIndicator = (position: IndicatorPosition): boolean => {
    if (templates.length <= 1) return false;
    
    switch (position) {
      case 'extra-far-left':
        return currentIndex >= 3;
      case 'far-left':
        return currentIndex >= 2;
      case 'near-left':
        return currentIndex >= 1;
      case 'center':
        return true;
      case 'near-right':
        return currentIndex <= totalSlides - 2;
      case 'far-right':
        return currentIndex <= totalSlides - 3;
      case 'extra-far-right':
        return currentIndex <= totalSlides - 4;
      default:
        return false;
    }
  };

  const indicatorPositions: IndicatorPosition[] = [
    'extra-far-left',
    'far-left',
    'near-left',
    'center',
    'near-right',
    'far-right',
    'extra-far-right'
  ];

  const offsetMap: Record<IndicatorPosition, number> = {
    'extra-far-left': -3,
    'far-left': -2,
    'near-left': -1,
    'center': 0,
    'near-right': 1,
    'far-right': 2,
    'extra-far-right': 3
  };

  // Если нет изображений, показываем заглушку
  if (templates.length === 0) {
    return (
      <div className="open">
        <div className="slider-container">
          <div className="slider">
            <div className="slides" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="slide">
                <p style={{ color: '#9A5656', fontSize: '24px', fontFamily: 'KuraleRegular' }}>
                  Нет доступных открыток
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="open">
      <div className="slider-container">
        <button 
          className="slider-btn prev-btn" 
          aria-label="Предыдущий слайд"
          onClick={() => goToSlide(currentIndex - 1)}
          disabled={isAnimating || templates.length <= 1}
        >
          <img src="src/client/img/left.png" alt="Previous" />
        </button>

        <div className="slider">
          <div className="slides" ref={slidesContainerRef}>
            {templates.map((image, index) => (
              <div 
                key={index} 
                className={`slide ${index === currentIndex ? 'active' : ''}`}
              >
                <img 
                  src={image.preview} 
                  className="slider_img" 
                  alt={`Открытка ${index + 1}`}
                  onError={(e) => {
                    // Обработка ошибок загрузки изображений
                    const target = e.target as HTMLImageElement;
                    target.src = 'src/client/img/placeholder.png'; // Запасное изображение
                    target.alt = `Не удалось загрузить изображение ${index + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Вернули индикаторы из HTML */}
          <div className="indicators">
            {/* Новые самые дальние */}
            <div 
              className={`indicator-item extra-far-left ${shouldShowIndicator('extra-far-left') ? '' : 'hidden'}`}
              onClick={() => goToSlide(currentIndex - 3)}
            >
              <div className="indicator-img-container">
                <img src="src/client/img/Ellipse.png" alt="" className="indicator-img" />
              </div>
            </div>
            
            <div 
              className={`indicator-item far-left ${shouldShowIndicator('far-left') ? '' : 'hidden'}`}
              onClick={() => goToSlide(currentIndex - 2)}
            >
              <div className="indicator-img-container">
                <img src="src/client/img/Ellipse.png" alt="" className="indicator-img" />
              </div>
            </div>
            
            <div 
              className={`indicator-item near-left ${shouldShowIndicator('near-left') ? '' : 'hidden'}`}
              onClick={() => goToSlide(currentIndex - 1)}
            >
              <div className="indicator-img-container">
                <img src="src/client/img/Ellipse.png" alt="" className="indicator-img" />
              </div>
            </div>

            <div 
              ref={centerIndicatorRef}
              className="indicator-item center"
              onClick={() => goToSlide(currentIndex)}
            >
              <div className="indicator-img-container active-indicator">
                <img src="src/client/img/Star.png" alt="" className="indicator-img active-indicator-img" />
              </div>
            </div>

            <div 
              className={`indicator-item near-right ${shouldShowIndicator('near-right') ? '' : 'hidden'}`}
              onClick={() => goToSlide(currentIndex + 1)}
            >
              <div className="indicator-img-container">
                <img src="src/client/img/Ellipse.png" alt="" className="indicator-img" />
              </div>
            </div>

            <div 
              className={`indicator-item far-right ${shouldShowIndicator('far-right') ? '' : 'hidden'}`}
              onClick={() => goToSlide(currentIndex + 2)}
            >
              <div className="indicator-img-container">
                <img src="src/client/img/Ellipse.png" alt="" className="indicator-img" />
              </div>
            </div>

            {/* Новые самые дальние */}
            <div 
              className={`indicator-item extra-far-right ${shouldShowIndicator('extra-far-right') ? '' : 'hidden'}`}
              onClick={() => goToSlide(currentIndex + 3)}
            >
              <div className="indicator-img-container">
                <img src="src/client/img/Ellipse.png" alt="" className="indicator-img" />
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="slider-btn next-btn" 
          aria-label="Следующий слайд"
          onClick={() => goToSlide(currentIndex + 1)}
          disabled={isAnimating || templates.length <= 1}
        >
          <img src="src/client/img/right.png" alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default Slider;