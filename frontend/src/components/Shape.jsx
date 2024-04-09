// Shape.jsx

import React from "react";

const getRandomValue = () => Math.floor(Math.random() * 100) + "%";
const getRandomPosition = () => {
  return { top: getRandomValue(), left: getRandomValue() };
};

const getRandomShape = () => {
  const shapes = ["triangle", "circle", "square", "star", "snowflake"];
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
};

const Shape = () => {
  const { top, left } = getRandomPosition();
  const type = getRandomShape();

  return <div className={`shape ${type}`} style={{ top, left }}></div>;
};

export default Shape;