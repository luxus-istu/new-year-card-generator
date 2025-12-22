import "./Header.css"

export default function Header() {
  return (
    <header className="header">
      <div className="left">
        <div className="title">
          <img src="/img/snow.png" alt="Снежинка" className="header_img" />
          <p className="header_name">FrostyCreations</p>
        </div>

        <h1 className="main_text">
          Дарите людям новогоднее настроение через онлайн открытки!
        </h1>

        <div className="not_img">
          <img src="/img/switch.png" alt="Switch" className="switch" />
          <img src="/img/another_snow.png" alt="Большая снежинка" className="header_snow_big" />
          <img src="/img/another_snow.png" alt="Средняя снежинка" className="header_snow_medium" />
          <img src="/img/another_snow.png" alt="Маленькая снежинка" className="header_snow_small" />
        </div>
      </div>

      {/* Правая колонка с изображением — используется только на ≥768px */}
      <div className="right">
        <img src="/img/header_img.png" alt="Новогодное изображение" />
      </div>
    </header>
  );
}
