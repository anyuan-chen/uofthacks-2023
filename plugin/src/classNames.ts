/* NEEDS REWRITE NOT WORKING */

import { getFrameInfo } from "./infoExtraction";
import {
  BasicFrameType,
  FrameChild,
  FrameInfo,
  TextInfo,
  TextType,
} from "./types";

export const fontSizeMapping: Record<string, string> = {
  12: "text-xs",
  14: "text-sm",
  16: "text-base",
  18: "text-lg",
  20: "text-xl",
  24: "text-2xl",
  30: "text-3xl",
  36: "text-4xl",
  48: "text-5xl",
  60: "text-6xl",
  72: "text-7xl",
  96: "text-8xl",
  128: "text-9xl",
};

export const fontWeightMapping: Record<string, string> = {
  100: "font-thin",
  200: "font-extralight",
  300: "font-light",
  400: "font-normal",
  500: "font-medium",
  600: "font-semibold",
  700: "font-bold",
  800: "font-extrabold",
  900: "font-black",
};

export const paddingMapping: Record<string, string> = {
  0: "0",
  1: "-px",
  2: "-0.5",
  4: "-1",
  6: "-1.5",
  8: "-2",
  10: "-2.5",
  12: "-3",
  14: "-3.5",
  16: "-4",
  20: "-5",
  24: "-6",
  28: "-7",
  32: "-8",
  36: "-9",
  40: "-10",
  44: "-11",
  48: "-12",
  56: "-14",
  64: "-16",
  80: "-20",
  96: "-24",
  112: "-28",
  128: "-32",
  144: "-36",
  160: "-40",
  176: "-44",
  192: "-48",
  208: "-52",
  224: "-56",
  240: "-60",
  256: "-64",
  288: "-72",
  320: "-80",
  384: "-96",
};

export const gapMapping: Record<string, string> = {
  0: "-0",
  2: "0.5",
  4: "1",
  6: "1.5",
  8: "2",
  10: "2.5",
  12: "3",
  14: "3.5",
  16: "4",
  20: "5",
  24: "6",
  28: "7",
  32: "8",
  36: "9",
  40: "10",
  44: "11",
  48: "12",
  56: "14",
  64: "16",
  80: "20",
  96: "24",
  112: "28",
  128: "32", 
  144: "36",
  160: "40",
  176: "44",
  192: "48",
  208: "52",
  224: "56",
  240: "60",
  256: "64",
  288: "72",
  320: "80",
  384: "96",
}

/*
  determines appropriate gap states for a flex-formatted UI
  eg. flex flex-col gap-y-4
*/

/*
  get the correct classname for a <div></div> tag that houses other components
*/
export function getLayoutClassname(node: FrameNode) {
  const info = getFrameInfo(node);
  const flexDirection = determineFlexDirection(info);
  return `${flexDirection}`;
}

export function getGapTwClassName(gapSizeInPx: number) {
  return getClosestValueToKey(gapSizeInPx, gapMapping);
}

/*
  given a number x, finds the key losest to x in the map mp, and returns the value associated with that key 
*/
function getClosestValueToKey(x: number, mp: Record<string, string>) {
  let below: string | null = null;
  let above: string | null = null;
  // we want to find the highest value below, and the lowest value above
  for (const key of Object.keys(mp)) {
    const key_num = parseInt(key);
    if (x > key_num) {
      below = key;
    } else if (!above) {
      above = key;
    }
  }
  // if there's nothing below or above this value, something went really wrong
  if (!below && !above) {
    console.error("logic error in textInfo parsing for map" + mp + "was" + x);
    throw "logic error in textInfo parsing for map" + mp + "was" + x;
  }
  // if it's below the min or above the max, round to those
  else if (!below && above) {
    return mp[above];
  } else if (!above && below) {
    return mp[below];
  }
  // if it's between two values, return the one that it's closer to
  else {
    const aboveDiff = parseInt(above as string) - x;
    const belowDiff = x - parseInt(below as string);
    const aboveAbsDiff = Math.min(aboveDiff, belowDiff);
    return aboveAbsDiff == aboveDiff
      ? mp[above as string]
      : mp[below as string];
  }
}

/*
  returns tailwind class of the font size in info
  eg. text-xl
*/
function getFontSizeTwClass(info: TextInfo): string {
 // console.log(info.fontSize);
  return getClosestValueToKey(info.fontSize, fontSizeMapping);
}

/*
  returns tailwind class of the font weight in info
  eg. font-bold
*/
function getFontWeightTwClass(info: TextInfo): string {
  return getClosestValueToKey(info.fontWeight, fontWeightMapping);
}

function getFontColorTwClass(info: TextInfo, label: TextType): string {
  if (label === TextType.BODY) {
    return "text-gray-700";
  }
  return "text-black";
}

export function getTextClassname(info: TextInfo, label: TextType): string {
  const textSizeClass = getFontSizeTwClass(info);
  const textColor = getFontColorTwClass(info, label);
  const weightClass = getFontWeightTwClass(info);

  const finalClass = `${textSizeClass} ${textColor} ${weightClass}`;
  return finalClass;
}

/*
  determineFlexDirection determines flex direction on whether the items are more roughly aligned as a column or row
*/
export function determineFlexDirection(info: FrameInfo) {
  /*
      get the max different in child x, and child y
      rows will have similar y
      columns will have similar x
      staircase style layouts are not supported 
    */
  if (info.childrenPadding.length <= 1) {
    return "flex-row";
  }


  // difference between the distance from the left boundary
  const sortedByLeftDifference = [...info.childrenPadding].sort(
    (c1: FrameChild, c2: FrameChild) => {
      return c1.leftPadding > c2.leftPadding === true ? 1 : 0;
    }
  );
  // difference bewteen the distance from the bottom boundary
  const sortedByTopDifference = [...info.childrenPadding].sort(
    (c1: FrameChild, c2: FrameChild) => {
      return c1.topPadding > c2.topPadding === true ? 1 : 0;
    }
  );

  // difference between furthest nodes for left
  const absLeftDiff = Math.abs(
    sortedByLeftDifference[sortedByLeftDifference.length - 1].leftPadding -
      sortedByLeftDifference[0].leftPadding
  );
  // difference betwee furthest nodes for top
  const absTopDiff = Math.abs(
    sortedByTopDifference[sortedByTopDifference.length - 1].topPadding -
      sortedByTopDifference[0].topPadding
  );

  //if the diff from the left border is very different, it's likely to be a row and should return as such

  return absLeftDiff > absTopDiff ? "flex-row" : "flex-col";
}

/*
    isSimilarPadding(lowest, highest, parentLength) returns if 
  */
function isSimilarPadding(
  lowest: number,
  highest: number,
  parentLength: number
) {
  return (highest - lowest) / parentLength < 0.05;
}

function getBasicFramePaddingTwClass(info: FrameInfo, type: BasicFrameType) {
  if (info.childrenPadding.length < 1) {
    return "";
  }
  const direction = determineFlexDirection(info);
  let baseLow;
  let baseHigh;
  let low: number; //left or top
  let high: number; //right or bottom
  if (direction == "flex-col") {
    baseLow = "pl";
    baseHigh = "pr";
    // if they are stacked vertically, the constant padding is the horizontal
    low = info.childrenPadding.reduce((lw, child) => {
      return lw + child.leftPadding;
    }, 0);
    high = info.childrenPadding.reduce((lw, child) => {
      return lw + child.rightPadding;
    }, 0);
  } else if (direction == "flex-row") {
    baseLow = "pt";
    baseHigh = "pb";
    low = info.childrenPadding.reduce((lw, child) => {
      return lw + child.topPadding;
    }, 0);
    high = info.childrenPadding.reduce((lw, child) => {
      return lw + child.bottomPadding;
    }, 0);
  } else {
    console.error("invalid direction" + direction);
    throw "invalid direction" + direction;
  }
  const avgLow = low / info.childrenPadding.length;
  const avgHigh = high / info.childrenPadding.length;
  // will be somthing like -24
  const roundLowClass = getClosestValueToKey(avgLow, paddingMapping);
  const roundHighClass = getClosestValueToKey(avgHigh, paddingMapping);

  return `${baseLow}${roundLowClass} ${baseHigh}${roundHighClass}`;
}

export function getBasicFrameClassname(info: FrameInfo, type: BasicFrameType) {
  /* make this into a map later if i have time */
  if (type === BasicFrameType.FORM_FIELD) {
    return ``;
  } else {
    return `${getBasicFramePaddingTwClass(info, type)}`;
  }
}

export function getVariantForButton(type: BasicFrameType) {
  let variant;
  if (BasicFrameType.BASIC_BUTTON === type) {
    variant = "default";
  } else if (BasicFrameType.DESTRUCTIVE_BUTTON === type) {
    variant = "destructive";
  } else if (BasicFrameType.OUTLINE_BUTTON === type) {
    variant = "outline";
  } else {
    console.error("no button varaint matching: type is" + type);
    throw "no button varaint matching: type is" + type;
  }
  return variant;
}
