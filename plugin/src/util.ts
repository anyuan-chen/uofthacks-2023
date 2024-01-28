import { imports } from "./code";
import { getFrameInfo, getTextInfo } from "./infoExtraction";
import { FrameInfo, TextInfo } from "./types";

function RGBAToHSLA(r: number, g: number, b: number, a: number) {
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;

  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return "hsla(" + h + "," + s + "%," + l + "%," + a * 100 + "%)";
}

export function getOverlayIDIfExists(node: FrameNode): string | null {
  const react = node.reactions;
  // console.log("[overlay]", node);
  let destinationId = null;
  react.forEach((rxn) => {
    rxn.trigger?.type == "ON_PRESS" || rxn.trigger?.type == "ON_CLICK";
    rxn.actions?.forEach((action) => {
      if (action.type === "NODE") {
        destinationId = action.destinationId;
      }
    });
  });
  return destinationId;
}

export function getTestData(node: FrameNode) {
  const label = node.name;
  let data = [];
  let output = "";
  for (const child of node.children) {
    if (child && child.type === 'FRAME') {
      
      //console.log("went here"); // get the info
      // console.log(info);
      const testData = {
        text: parseFrameInfoIntoEnglish(getFrameInfo(child)),
        label: label
      }
      output += JSON.stringify(testData) + "\n";
      // console.log(JSON.stringify(testData));
    } else if (child && child.type == 'TEXT') {
      const testData = {
        text: parseTextInfoIntoEnglish(getTextInfo(child)),
        label: label
      }
      output += JSON.stringify(testData) + "\n";
    }
  }
  return output;
}

export function addUseStateToImports(
  imports: string,
  name: string,
  type: number | string
) {
  if (!imports.includes(`import React from 'react'`)) {
    imports = `import React from 'react' \n ${imports}`;
  }
  return `${imports} \n const [${name}, set${name}] = React.useState("")`;
}

export { RGBAToHSLA };

function parseTextInfoIntoEnglish(data: TextInfo) {
  return `The font weight of this text is ${data.fontWeight}, the font size of this text is ${data.fontSize}, the height of this text is ${data.height}, the width of this text is ${data.width}, the relative font size is ${data.relativeFontSizeRank}, the font color of this is ${data.fontColor}, the content of the text is ${data.text}.`;
}

export { parseTextInfoIntoEnglish };

function parseFrameInfoIntoEnglish(data: FrameInfo): string {
  let output = `The name of this frame is ${data.name}, the height of this frame is ${data.height}, the width of this frame is ${data.width}, the fill of this frame is ${data.fills} `;
  output += data.borderFill? `the frame has an outline. ` : "this frame does not have an outline. " 
  for (const child of data.childrenPadding) {
    if ("text" in child.node) {
      output += parseTextInfoIntoEnglish(child.node);
    }
  }
  return output;
}

export { parseFrameInfoIntoEnglish }
