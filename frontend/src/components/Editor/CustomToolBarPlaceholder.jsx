import React from "react";

const CustomToolBarPlaceholder = ({ icons = [] }) => {
  return (
    <div>
      {icons.map((icon, index) => (
        <span
          key={index}
          onClick={(e) => icon.onClick(e)}
          type="button"
          className={icon.classes}
          title={icon.title}
        ></span>
      ))}
    </div>
  );
};

export default CustomToolBarPlaceholder;



