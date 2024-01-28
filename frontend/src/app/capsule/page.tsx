"use client";
import React, { useState } from "react";
import { JourneyData } from "./journeyData/getAllData";

const Page = () => {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<JourneyData>(null);
  return (
    <ThemeContext.Provider value={Themes.winXP}>
      <XPLayout setTheme={setTheme}>
        <div className={fontFamily}>{children}</div>
      </XPLayout>
    </ThemeContext.Provider>
  );
};

export default Page;
