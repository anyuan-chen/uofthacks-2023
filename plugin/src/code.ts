// This plugin will generate a sample codegen plugin
// that appears in the Element tab of the Inspect panel.

import getFormMap from "./formRecursionMapSummation";
import { getFrameInfo, getTextInfo } from "./infoExtraction";
import { traverse } from "./traversal";
import { RGBAToHSLA, getTestData, parseFrameInfoIntoEnglish, parseTextInfoIntoEnglish } from "./util";


// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

export let imports = "";

function getOverlayFrame(destinationId: string) {}

//heuristic - if a text is right above a frame that gets detected as a node, then make it a form label
// This provides the callback to generate the code.
figma.codegen.on("generate", async (event: CodegenEvent) => {
  imports = "";
  const root = figma.currentPage.selection[0];
  if (root.type === 'FRAME') {
    console.log(parseFrameInfoIntoEnglish(getFrameInfo(root)));
  }
  if (root.type === 'TEXT') {
    console.log(parseTextInfoIntoEnglish(getTextInfo(root)));
  }
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
  const program = await traverse(root, null, "", "", formMap); // the code in string format
  // const formattedCode = await prettier.format(program, {parser: "typescript"});
  // console.log(prettier.format("foo();", {parser: "babel"}));
  const result: CodegenResult[] = [
    {
      language: "TYPESCRIPT",
      code: program,
      title: "poggers",
    },
  ];
  return result;
});
