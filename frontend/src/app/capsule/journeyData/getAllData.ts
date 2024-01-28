import React from "react";
import { Themes } from "../../journey/layout";
import Neopet from "./neopets";
import XPLayout from "@/app/blissbackground/winXP";

export type JourneyData = {
  component: React.Component;
  layout: React.Component;
  theme: Themes;
};
const data: JourneyData[] = [
  {
    component: Neopet,
    layout: XPLayout,
    theme: Themes.winXP,
  },
];
export const GetAllData = () => {
  return data;
};

export const GetIndexData = (index: number) : JourneyData => {
  return data[index];
};

