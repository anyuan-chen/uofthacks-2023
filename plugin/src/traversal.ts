/*
    traverse builds a tree of nodes and their types/props needed for final compilation
*/

import { serializeBasicNode, serializeLayout } from "./serializeNode";
import { BasicFrameType } from "./types";

async function traverse(
  base: FrameNode | TextNode,
  imports: string,
  hooks: string,
  formMap: Record<string, boolean>
): Promise<string> {
  //console.log(base.type, base.type === "FRAME" ? isBasicComponent(base) : "");
  if (base.type == "TEXT" || isBasicComponent(base)) {
    return await serializeBasicNode(base, imports, hooks, formMap);
  } else {
    return await serializeLayout(base, imports, hooks, formMap);
  }
}

function isBasicComponent(node: FrameNode) {
  const numberTextChild = node.children.reduce(
    (prev: number, cur: SceneNode) => {
      if (cur.type == "TEXT") {
        return prev + 1;
      }
      return prev;
    },
    0
  );
  if (!hasFrameChildren(node) && numberTextChild < 2) {
    return true;
  }
  return false;
}

function getComponentType(node: FrameNode): BasicFrameType {
  return BasicFrameType.BASIC_BUTTON;
}

function hasFrameChildren(node: FrameNode) {
  if (!("children" in node)) {
    return false;
  }
  for (const child of node.children) {
    if (child.type === "FRAME") {
      return true;
    }
  }
  return false;
}

export { traverse };
