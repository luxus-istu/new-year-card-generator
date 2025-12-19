import React, {useState, useCallback} from 'react';
import Slider from './slider';
import CardForm from './CardForm';
import { TemplateMeta } from '../../types';

const SigmaSection: React.FC = () => {
  // Массив изображений для слайдера
  // const cardImages = [
  //   'img/rebenok_s_ognem.png',
  //   'img/card2.png',
  //   'img/card3.png',
  //   'img/card4.png',
  //   'img/card5.png',
  //   'img/card6.png',
  //   'img/card7.png',
  //   'img/card8.png',
  //   'img/card1.png'
  // ];
  //спасите
  // Или можно получать из API
  const [cardImages, setCardImages] = useState<TemplateMeta[]>([]);
  React.useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setCardImages(data)
    } catch (error) {
      console.error(error)
    }
  }, []);

  return (
    <section className="sigma">
      <div className="sigma_title">
        <img src="src/client/img/list.png" alt="list" className="list" />
        <h1 className="sigma_name">Волшебство создаётся здесь</h1>
        <img src="src/client/img/list1.png" alt="list" className="list1" />
      </div>
      <h1 className="open_title">Выберите открытку:</h1>
      <div className="sigma_items">
        <Slider templates={cardImages} />
        <CardForm />
      </div>
    </section>
  );
};

export default SigmaSection;