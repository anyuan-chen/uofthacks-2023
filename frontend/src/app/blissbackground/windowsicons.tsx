import React from "react";

const SpecialButton = ({ variant }: any) => {
  let backgroundImage = "";
  let hoverImage = "";
  if (variant === "minimize") {
    backgroundImage = "url('/minimize.svg')";
    hoverImage = "url('/minimize-hover.svg')";
  } else if (variant === "maximize") {
    backgroundImage = "url('/maximize.svg')";
    hoverImage = "url('/maximize-hover.svg')";
  } else if (variant === "close") {
    backgroundImage = "url('/close.svg')";
    hoverImage = "url('/close-hover.svg')";
  }

  return (
    <button
      style={{
        minWidth: "21px",
        minHeight: "21px",
        marginLeft: "2px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%",
        boxShadow: "none",
        backgroundColor: "#0050ee",
        transition: "background .1s",
        border: "none",
        backgroundImage: backgroundImage,
      }}
      id={backgroundImage}
      onMouseOver={(e) => {
        const element = document.getElementById(backgroundImage);
        if (!element) {
          return;
        }
        console.log(backgroundImage)
        element.style.backgroundImage = hoverImage;
      }}
      onMouseOut={(e) => {
        const element = document.getElementById(backgroundImage);
        if (!element) {
          return;
        }
        console.log(backgroundImage)
        element.style.backgroundImage = backgroundImage;
      }}
    ></button>
  );
};

export default SpecialButton;