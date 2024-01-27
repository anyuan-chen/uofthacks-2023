import { imports } from "./code";

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
  react.forEach((rxn) => {
    rxn.trigger?.type == "ON_PRESS" || rxn.trigger?.type == "ON_CLICK";
    rxn.actions?.forEach((action) => {
      if (action.type === "NODE") {
        return action.destinationId;
      }
    });
  });
  return null;
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
