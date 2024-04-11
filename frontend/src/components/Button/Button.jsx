import React from "react";
import { getClasses } from "../../utils/getClasses";
import styles from "./Button.module.css";
import classNames from "classnames";



const buttonTypes = {
  primary: "primary",
  dark: "dark",
  danger: "danger",
  success:"success"
};


const Button = ({type, variant, classes,text, onClick,iconClass, ...rest}) => {

  let extraClasses = getClasses([classes])

  let btnClasses = classNames('btn',`${extraClasses}`, `${styles.button}`, `${styles[`btn--${buttonTypes[variant]}`]}`)


  return (<button type={type} className={btnClasses} onClick={onClick} {...rest}>{iconClass !=="" && (<i className={iconClass}></i>)} {text} {rest.children}</button>)

}


Button.defaultProps = {
  classes: "",
  type: "button",
  variant: "primary",
  text:"button",
  iconClass:"",
  onClick: () => null,
};

export default Button;
