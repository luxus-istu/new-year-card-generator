export default function Header() {
  return (
    <header className="header">
      <div className="left">
        <div className="title">
          <img src="src/client/img/snow.png" alt="Snezhinka" className="header_img" />
          <p className="header_name">FrostyCreations</p>
        </div>
        <h1 className="main_text">Дарите людям новогоднее настроение через онлайн открытки!</h1>
        <div className="not_img">
          <img src="src/client/img/switch.png" className="switch" alt="Switch" />
          <img src="src/client/img/another_snow.png" className="header_snow_big" alt="Snowflake" />
          <img src="src/client/img/another_snow.png" className="header_snow_medium" alt="Snowflake" />
          <img src="src/client/img/another_snow.png" className="header_snow_small" alt="Snowflake" />
        </div>
      </div>
      <div className="right">
        <img src="src/client/img/header_img.png" className="main_img" alt="Main header" />
      </div>
    </header>
  );
};
