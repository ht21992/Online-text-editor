import React, { Fragment } from "react";
import { getClasses } from "../../utils/getClasses";
import classNames from "classnames";
import styles from "./Image.module.css";

const ImageTypes = {
  avatar: "avatar",
  dash_avatar: "dash_avatar",
};

const Image = ({
  classes,
  is_loading,
  src,
  width,
  height,
  variant,
  ...rest
}) => {
  var classes = getClasses([classes]);

  var ImageClass = classNames(classes, `${styles[`${ImageTypes[variant]}`]}`);

  if (is_loading) {
    return (
      <img
        src="/static/image/Curve-Loading.gif"
        width={width}
        className={ImageClass}
        height={height}
        {...rest}
      />
    );
  } else {
    return (
      <img
        className={ImageClass}
        src={src}
        width={width}
        height={height}
        variant=""
        {...rest}
      />
    );
  }
};

Image.defaultProps = {
  classes: "",
  src: "./avatar.webp",
};

export default Image;
