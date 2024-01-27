// This plugin will generate a sample codegen plugin
// that appears in the Element tab of the Inspect panel.

import getFormMap from "./formRecursionMapSummation";
import { traverse } from "./traversal";
import { RGBAToHSLA } from "./util";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

export let imports = "";

function getOverlayFrame(destinationId: string) {}

//heuristic - if a text is right above a frame that gets detected as a node, then make it a form label

/*
  distanceBetweenParentChild(frame, child) calculates how far the borders are from the parent frame borders

  assumes that the parent fully contains the child, 
  ie. all four corners of the child are within the parent rectangle
*/
// const distanceBetweenParentChild = (
//   frame: FrameNode,
//   child: TextNode | FrameNode
// ) => {
//   const frameBox = frame.absoluteRenderBounds;
//   const childBox = child.absoluteRenderBounds;

//   if (!frameBox) {
//     const msg = `frame box with id ${frame.id} is null`;
//     console.error(msg);
//     throw msg;
//   } else if (!childBox) {
//     const msg = `child box with id ${frame.id} is null`;
//     console.error(msg);
//     throw msg;
//   }

//   const leftPadding = childBox.x - frameBox?.x;
//   const rightPadding =
//     frameBox.x + frameBox.width - (childBox.x + childBox.width);

//   const topPadding = childBox.y - frameBox.y;
//   const bottomPadding =
//     frameBox.y + frameBox.height - (childBox.y + childBox.height);

//   return {
//     leftPadding,
//     rightPadding,
//     topPadding,
//     bottomPadding,
//   };
// };

// const getFills = (node: FrameNode | TextNode) => {
//   const fills = [];
//   if (node.fills != figma.mixed && node.fills[0].type == "SOLID") {
//     for (const fill of node.fills) {
//       if (fill.type === "SOLID") {
//         const hsl = RGBAToHSLA(
//           fill.color.r,
//           fill.color.g,
//           fill.color.b,
//           fill.opacity || 1
//         );
//         fills.push(hsl);
//         // const opacity = fill.opacity;
//       }
//     }
//   }
//   return fills;
// };

// function serializeNode(node: FrameNode | TextNode) {
//   if (node.type === "TEXT") {
//     const textNode = node;
//     const fontSize = textNode.fontSize;
//     const fontWeight = textNode.fontWeight;
//   } else {
//     const paddingLevels = [];
//     for (const child of node.children) {
//       child.absoluteBoundingBox;
//     }
//   }
// }

// This provides the callback to generate the code.
figma.codegen.on("generate", async (event: CodegenEvent) => {
  imports = "";
  const root = figma.currentPage.selection[0];
  if (root.type != "FRAME") {
    console.error("select a frame");
    const result: CodegenResult[] = [
      {
        language: "PLAINTEXT",
        code: "",
        title: "plugin",
      },
    ];
    return result;
  }
  figma.skipInvisibleInstanceChildren = true;
  const formMap = getFormMap(root);
  const program = await traverse(root, "", "", formMap);

  console.log(await program);

  const result: CodegenResult[] = [
    {
      language: "PLAINTEXT",
      code: await program,
      title: "Codegen Plugin",
    },
  ];
  return result;
});
