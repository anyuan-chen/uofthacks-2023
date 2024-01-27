/*
    The goal of this file is to provide a simple library of functions that extract node information
*/

import { FrameInfo, TRANSPARENT_FILL, TextInfo } from "./types";
import { RGBAToHSLA } from "./util";

function getAllFontSizes(): number[] {
  const rootFrameNode = figma.currentPage.selection[0];
  if (rootFrameNode.type != "FRAME") {
    const msg = "selected page is not a frame, that is bad";
    console.error(msg);
    throw msg;
  }
  const textNodes = rootFrameNode.findAll((node) => {
    return node.type === "TEXT";
  });
  const fontSizes: number[] = [];
  for (const textNode of textNodes) {
    if (textNode.type != "TEXT") {
      const msg = `something went wrong with getting all the text nodes, this node has type ${textNode.type} instead`;
      console.error(msg);
      throw msg;
    }
    let fontSize =
      textNode.fontSize == figma.mixed
        ? textNode.getRangeFontSize(0, 1)
        : textNode.fontWeight;
    if (fontSize == figma.mixed) {
      const msg = `Font size of one character is not a single font size`;
      console.error(msg);
      throw msg;
    }
    fontSizes.push(fontSize);
  }
  return fontSizes;
}

export const getFills = (node: FrameNode | TextNode) => {
  const fills = [TRANSPARENT_FILL];
  if (
    node.fills != figma.mixed &&
    node.fills.length > 0 &&
    node.fills[0].type == "SOLID"
  ) {
    for (const fill of node.fills) {
      if (fill.type === "SOLID") {
        const hsl = RGBAToHSLA(
          fill.color.r,
          fill.color.g,
          fill.color.b,
          fill.opacity || 1
        );
        fills.push(hsl);
        // const opacity = fill.opacity;
      }
    }
  }
  return fills;
};

export function getTextInfo(node: TextNode): TextInfo {
  let fontWeight =
    node.fontWeight == figma.mixed
      ? node.getRangeFontWeight(0, 1)
      : node.fontWeight;
  let fontSize =
    node.fontSize == figma.mixed ? node.getRangeFontSize(0, 1) : node.fontSize;

  if (fontWeight == figma.mixed) {
    const msg = `Font weight of one character is not a single font weight`;
    console.error(msg);
    throw msg;
  }

  if (fontSize == figma.mixed) {
    const msg = `Font size of one character is not a single font size`;
    console.error(msg);
    throw msg;
  }
  const fontSizeLookup = new Map<number, boolean>();
  const allFontSizes = getAllFontSizes();
  let rank = 0; // lower rank means bigger
  // so I need to find how many fonts are bigger than me
  let total = 0;
  for (const size of allFontSizes) {
    if (!fontSizeLookup.has(size)) {
      if (fontSize < size) {
        rank++;
      }
      total++; // new unique font size
      fontSizeLookup.set(size, true);
    }
  }
  const id = node.id;

  return {
    id,
    fontWeight: fontWeight,
    fontSize: fontSize,
    height: node.height,
    width: node.width,
    relativeFontSizeRank: {
      rank: rank,
      total: total,
    },
    fontColor: getFills(node)[0], // should only have one fill
    text: node.characters,
  };
}

export const distanceBetweenParentChild = (
  frame: FrameNode,
  child: TextNode | FrameNode
) => {
  const frameBox = frame.absoluteRenderBounds;
  const childBox = child.absoluteRenderBounds;

  if (!frameBox) {
    const msg = `frame box with id ${frame.id} is null`;
    console.error(msg);
    throw msg;
  } else if (!childBox) {
    const msg = `child box with id ${frame.id} is null`;
    console.error(msg);
    throw msg;
  }  

  const leftPadding = childBox.x - frameBox?.x;
  const rightPadding =
    frameBox.x + frameBox.width - (childBox.x + childBox.width);

  const topPadding = childBox.y - frameBox.y;
  const bottomPadding =
    frameBox.y + frameBox.height - (childBox.y + childBox.height);

  return {
    leftPadding,
    rightPadding,
    topPadding,
    bottomPadding,
  };
};

export function getFrameInfo(node: FrameNode): FrameInfo {
  const childrenPadding = [];
  for (const child of node.children) {
    if (child.type !== "FRAME" && child.type !== "TEXT") {
      continue;
    }

    const { leftPadding, rightPadding, topPadding, bottomPadding } =
      distanceBetweenParentChild(node, child);
    const childNode =
      child.type == "FRAME" ? getFrameInfo(child) : getTextInfo(child);

    if (child.type == "FRAME") {
      childrenPadding.push({
        id: childNode.id,
        node: childNode,
        leftPadding: leftPadding,
        rightPadding: rightPadding,
        topPadding: topPadding,
        bottomPadding: bottomPadding,
      });
    }
    if (child.type == "TEXT") {
      childrenPadding.push({
        id: childNode.id,
        node: childNode,
        leftPadding: leftPadding,
        rightPadding: rightPadding,
        topPadding: topPadding,
        bottomPadding: bottomPadding,
      });
    }
  }
  const id = node.id;

  return {
    id,
    name: node.name,
    height: node.height,
    width: node.width,
    fills: getFills(node)[0], // should only have one fill
    childrenPadding: childrenPadding,
  };
}
