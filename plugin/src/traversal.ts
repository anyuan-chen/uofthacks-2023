/*
    traverse builds a tree of nodes and their types/props needed for final compilation
*/

import { serializeNodeWithDialog } from "./dialogs";
import { serializeBasicNode, serializeLayout } from "./serializeNode";
import { BasicFrameType } from "./types";
import { getOverlayIDIfExists } from "./util";

async function traverse(
  base: FrameNode | TextNode,
  parent: FrameNode | null,
  imports: string,
  hooks: string,
  formMap: Record<string, boolean>
): Promise<string> {
  //console.log(base.type, base.type === "FRAME" ? isBasicComponent(base) : "");

  const overlayId = base.type === 'FRAME'? getOverlayIDIfExists(base) : null;

  if (base.type === 'FRAME' && overlayId && parent?.id != overlayId) {
    return await serializeNodeWithDialog(base, imports, hooks, formMap);
  }

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
