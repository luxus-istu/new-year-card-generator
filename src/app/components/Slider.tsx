import { useState, useRef, useEffect } from 'react';
import type { Template } from '@/app/types';
import "./Slider.css";

type ImagesProps = {
  templates: Template[]
}

interface SliderProps extends ImagesProps {
  onSlideChange: (template: Template) => void;
}

export default function Slider({ templates, onSlideChange }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const prevIndexRef = useRef<number>(0);

  const total = templates.length;

  const goToPrevious = () => {
    prevIndexRef.current = currentIndex;
    const newIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    prevIndexRef.current = currentIndex;
    const newIndex = currentIndex === total - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const wasWrapping =
      (prevIndexRef.current === total - 1 && currentIndex === 0) ||
      (prevIndexRef.current === 0 && currentIndex === total - 1);

    if (wasWrapping) {
      setIsTransitioning(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }

    onSlideChange(templates[currentIndex]!);
  }, [currentIndex, templates, onSlideChange]);

  if (total === 0) {
    return <div>Нет шаблонов для отображения</div>;
  }

  const getVisibleDotIndices = (): number[] => {
    if (total === 1) return [0];
    if (total === 2) return [0, 1];

    const prev = currentIndex === 0 ? total - 1 : currentIndex - 1;
    const next = currentIndex === total - 1 ? 0 : currentIndex + 1;

    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleDotIndices();

  return (
    <div className="slider">
      <div className="slider__viewport">
        <div
          className="slider__track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none',
          }}
        >
          {templates.map((template, index) => (
            <div key={index} className="slider__slide">
              <img
                src={template.url}
                alt={template.name}
                className="slider__image"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="slider__controls">
        <button className="slider__btn slider__btn--prev" onClick={goToPrevious}>
          ❮
        </button>

        <div className="slider__dots-container">
          <div className="slider__dots-track">
            {visibleIndices.map((index) => (
              <span
                key={index}
                className={`slider__dot ${index === currentIndex ? 'slider__dot--active' : ''}`}
              // Убрано onClick — точки больше не кликабельны
              />
            ))}
          </div>
          <div className="slider__dots-indicator" />
        </div>

        <button className="slider__btn slider__btn--next" onClick={goToNext}>
          ❯
        </button>
      </div>
    </div>
  );
}
