"use client";
import React from "react";

const Page = () => {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<
  return (
    <ThemeContext.Provider value={Themes.winXP}>
      <XPLayout setTheme={setTheme}>
        <div className={fontFamily}>{children}</div>
      </XPLayout>
    </ThemeContext.Provider>
  );
};

export default Page;
