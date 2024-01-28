"use client";
import React, { useEffect, useState } from "react";
import { ThemeContext, Themes } from "../journey/layout";
import Win7LayoutCapsule from "./win7";
import XPLayoutCapsule from "./winXP";
import VercelLayoutCapsule from "./vercel";
import Neopet from "./journeyData/neopets";

const max = 0;

const Page = () => {
  const [index, setIndex] = useState(0);
  let [comp, setComp] = useState(<div></div>);
  useEffect(() => {
    if (index === 0) {
      setComp(<Neopet></Neopet>);
    }
  }, [index]);
  const xpTheme: number[] = [0];
  const sevenTheme: number[] = [];
  const vercelTheme: number[] = [];

  if (xpTheme.includes(index)) {
    return (
      <ThemeContext.Provider value={Themes.winXP}>
        <XPLayoutCapsule
          index={index}
          setIndex={setIndex}
          max={max}
          key={index}
        >
          {comp}
        </XPLayoutCapsule>
      </ThemeContext.Provider>
    );
  } else if (sevenTheme.includes(index)) {
    return (
      <ThemeContext.Provider value={Themes.win7}>
        <Win7LayoutCapsule
          index={index}
          setIndex={setIndex}
          max={max}
          key={index}
        >
          {comp}
        </Win7LayoutCapsule>
      </ThemeContext.Provider>
    );
  } else if (vercelTheme.includes(index)) {
    return (
      <ThemeContext.Provider value={Themes.vercel}>
        <VercelLayoutCapsule
          index={index}
          setIndex={setIndex}
          max={max}
          key={index}
        >
          {comp}
        </VercelLayoutCapsule>
      </ThemeContext.Provider>
    );
  }

  return <div>oops! the end.</div>;
};

export default Page;
