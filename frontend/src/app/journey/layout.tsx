"use client";
import React, { createContext, useState } from "react";

import XPLayout from "../blissbackground/winXP";
import { Button } from "@/components/ui/button";
import Win7Layout from "../blissbackground/win7";
import Vercel from "../blissbackground/vercel";
import { inter, segoe, trebuchet } from "../layout";
export enum Themes {
  winXP,
  win7,
  vercel,
}
export const ThemeContext = createContext<Themes>(Themes.winXP);

const Layout = ({ children }: any) => {
  const [theme, setTheme] = useState(Themes.winXP);

  const fontFamily =
    theme === Themes.winXP
      ? trebuchet.className
      : theme === Themes.win7
      ? segoe.className
      : inter.className;

  if (theme === Themes.winXP) {
    return (
      <ThemeContext.Provider value={Themes.winXP}>
        <XPLayout setTheme={setTheme}>
          <div className={fontFamily}>{children}</div>
        </XPLayout>
      </ThemeContext.Provider>
    );
  } else if (theme === Themes.win7) {
    return (
      <ThemeContext.Provider value={Themes.win7}>
        <Win7Layout setTheme={setTheme}>
          <div className={fontFamily}>{children}</div>
        </Win7Layout>{" "}
      </ThemeContext.Provider>
    );
  } else if (theme === Themes.vercel) {
    return (
      <ThemeContext.Provider value={Themes.vercel}>
        <Vercel setTheme={setTheme}>
          <div className={fontFamily}>{children}</div>
        </Vercel>
      </ThemeContext.Provider>
    );
  }
};

export default Layout;
