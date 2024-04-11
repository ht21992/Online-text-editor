import React, { useRef } from "react";
import toast from "react-hot-toast";
import Button from "../Button/Button";
const InputMaker = (props) => {
  const InputBox = useRef(null);

  const handleSubmit = (e) => {
    if (e.target.tagName == "INPUT") {
      if (e.which == 13 || e.keyCode == 13) {
        if (InputBox.current.value.length <= 0) {
          props.handleChange(props.value);
          toast("Nothing Changed", {
            icon: "💡",
          });
          props.handleBlur();
        } else {
          props.handleChange(InputBox.current.value);
          props.handleBlur();
        }
      }
    }
    // pressing Change Button
    else {
      if (InputBox.current.value.length <= 0) {
        props.handleChange(props.value);
        toast("Nothing Changed", {
          icon: "💡",
        });
        props.handleBlur();
      } else {
        props.handleChange(InputBox.current.value);
        props.handleBlur();
      }
    }
  };

  return (
    <span>
      {props.showInputEle ? (
        <div className="input-group my-3">
          <input
            ref={InputBox}
          
            type="text"
            className="form-control "
            placeholder={props.value}
            autoFocus
            onKeyDown={handleSubmit}
          />
          <div className="input-group-append">
            <Button
              title="Change text"
              type="submit"
              variant="dark"
              text="Change"
              onClick={handleSubmit}
            />
          </div>
        </div>
      ) : (
        <span
          onDoubleClick={props.handleDoubleClick}
          style={{
            display: "inline-block",
            height: "25px",
            minWidth: "300px",
            cursor: "pointer",
          }}
          title="Double Click to change"
          className="my-2"
        >
          <p style={props.styles}>{props.value}</p>
        </span>
      )}
    </span>
  );
};

export default InputMaker;
