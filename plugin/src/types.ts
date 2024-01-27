export interface FrameInfo {
  id: string;
  name: string;
  height: number;
  width: number;
  fills: string; //background color

  childrenPadding: FrameChild[];
}

export interface FrameChild {
  id: string;
  node: FrameInfo | TextInfo;
  leftPadding: number;
  rightPadding: number;
  topPadding: number;
  bottomPadding: number;
}
  
export const TRANSPARENT_FILL = "hsla(0, 0%, 0%, 0)";

export interface RelativeFontSizeRank {
  rank: number;
  total: number;
}

export interface TextInfo {
  id: string;
  fontWeight: number;
  fontSize: number;
  height: number;
  width: number;
  relativeFontSizeRank: RelativeFontSizeRank;
  fontColor: string;
  text: string;
}

export enum Triggers {
  "OVERLAY",
}

export enum BasicFrameType {
  BASIC_BUTTON,
  OUTLINE_BUTTON,
  DESTRUCTIVE_BUTTON,
  FORM_FIELD,
}

export enum TextType {
  HEADING,
  BODY,
}
