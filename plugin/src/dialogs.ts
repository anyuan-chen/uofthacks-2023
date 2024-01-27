import { getFrameInfo } from "./infoExtraction";
import { traverse } from "./traversal";
import { getOverlayIDIfExists } from "./util";

async function serializeNodeWithDialog(
  node: FrameNode,
  imports: string,
  hooks: string,
  formMap: Record<string, boolean>
) {
  const id = getOverlayIDIfExists(node);
  if (!id) {
    throw "why did you serialize a node with no overlay? bruh moment";
  }

  const nodeWithId = figma.getNodeById(id);
  if (nodeWithId?.type !== "FRAME") {
    return;
  }
  const normalSerialization = await traverse(node, imports, hooks, formMap);
  const dialogContent = await traverse(nodeWithId, imports, hooks, formMap);

  return `
        <Dialog>
            <DialogTrigger asChild>
                ${normalSerialization}
            </DialogTrigger>
            <DialogContent>
                ${dialogContent}
            </DialogContent>
        </Dialog>
    `;
}