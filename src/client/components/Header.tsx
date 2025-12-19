import React from 'react';
import '../index.css';

const Header = () => {
  return (
    <header className="header">
      <div className="left">
        <div className="title">
          <img src="src/client/img/snow.png" alt="Snezhinka" className="header_img" />
          <span className="header_name">FrostyCreations</span>
        </div>
        <h1 className="main_text">
          Дарите людям новогоднее настроение через онлайн открытки!
        </h1>
        <div className="not_img">
          <img src="src/client/img/switch.png" alt="Switch" className="switch" />
          <img
            src="/img/another_snow.png"
            alt="Snow Big"
            className="header_snow_big"
          />
          <img
            src="/img/another_snow.png"
            alt="Snow Medium"
            className="header_snow_medium"
          />
          <img
            src="/img/another_snow.png"
            alt="Snow Small"
            className="header_snow_small"
          />
        </div>
      </div>
      <div className="right">
        <img src="/img/header_img.png" alt="Main visual" className="main_img" />
      </div>
    </header>
  );
};

export default Header;