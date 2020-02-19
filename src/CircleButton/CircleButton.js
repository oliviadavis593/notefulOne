import React from "react";
import "./CircleButton.css";

export default function NavCircleButton(props) {
  const { tag, className, childrenm, ...otherProps } = props;

  return React.createElement(
    props.tag,
    {
      className: ["NavCircleButton", props.className].join(" "),
      ...otherProps
    },
    props.children
  );
}

NavCircleButton.defaultProps = {
  tag: "a"
};

/* ======= Building the static app (#2) ======= */
//Create add button for both folders and note sections
//It will be the child of both of those components
//CircleButton.js ===> Note.js
