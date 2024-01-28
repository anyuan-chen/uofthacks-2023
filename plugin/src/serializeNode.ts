import {
  determineFlexDirection,
  getBasicFrameClassname,
  getGapTwClassName,
  getLayoutClassname,
  getTextClassname,
  getVariantForButton,
} from "./classNames";
import { classify } from "./cohere";
import { getFrameInfo, getTextInfo } from "./infoExtraction";
import { traverse } from "./traversal";
import {
  BasicFrameType,
  FrameChild,
  FrameInfo,
  TextInfo,
  TextType,
} from "./types";

/*
  
*/
async function serializeBasicNode(
  node: FrameNode | TextNode,
  imports: string,
  hooks: string,
  formMap: Record<string, boolean>
): Promise<string> {
  if (node.type === "TEXT") {
    return await serializeText(node, formMap);
  } else if (node.type == "FRAME") {
    return await serializeBasicFrame(node, imports, hooks);
  }
  console.error("node type not frame or text, failed serialization");
  throw "";
}

type PaddingInfo = {
  leftPadding: number;
  rightPadding: number;
  topPadding: number;
  bottomPadding: number;
}

type FrameSpaceInfo = {
  // node: SceneNode;
  height: number;
  width: number;
  padding: PaddingInfo,
  html: string;
};

function getVerticalSpacing(node1: FrameSpaceInfo, node2: FrameSpaceInfo) {
  if (node2.padding.topPadding > node1.padding.topPadding) {
    return node2.padding.topPadding - node1.padding.topPadding - node1.height;
  }
  return  node1.padding.topPadding - node2.padding.topPadding - node2.height;
}


function getHorizontalSpacing(node1: FrameSpaceInfo, node2: FrameSpaceInfo) {
  if (node2.padding.leftPadding > node1.padding.leftPadding) {
    return node2.padding.leftPadding - node1.padding.leftPadding - node1.width;
  }
  return  node1.padding.leftPadding - node2.padding.leftPadding - node2.width;

}

function getSpacing(node1: FrameSpaceInfo, node2: FrameSpaceInfo, direction: string) {
  return direction === "flex-row"? getHorizontalSpacing(node1, node2) : getVerticalSpacing(node1, node2);
}

// x is first value, y is second value, tolerance is percentage (0 to 1) representing how much difference can be between x and y
// might need to fix
function isSimilarSpacing(x:number, y: number, parentLength:number,tolerance:number) {
  return Math.abs(x - y) / parentLength < tolerance;
}

// "get the closets padding to the parent div"
function getMinPadding(padding1: PaddingInfo, padding2: PaddingInfo) {
  return {
    leftPadding: Math.min(padding1.leftPadding, padding2.leftPadding),
    rightPadding: Math.min(padding1.rightPadding, padding2.rightPadding),
    topPadding: Math.min(padding1.topPadding, padding2.topPadding),
    bottomPadding: Math.min(padding1.bottomPadding, padding2.bottomPadding)
  }
}

// assumes children is sorted 
function mergeChildren(children: FrameSpaceInfo[], direction: string) {
  if (children.length === 0) {
    return "";
  }
  if (children.length == 1) {
    return children[0].html;
  }

  const node1 = children[0];
  const node2 = children[1];
  const gapSize = getSpacing(node1, node2, direction);
  let newPadding = node1.padding;

  newPadding = getMinPadding(newPadding, children[1].padding);
  
  let newWidth = node1.width + node2.width;
  let newHeight = node1.height + node2.height;
  
  if (direction === "flex-row") {
    newWidth += getHorizontalSpacing(node1, node2);
  }
  if (direction == "flex-col") {
    newHeight += getVerticalSpacing(node1, node2);
  }
  
  const gap_xy = direction === "flex-row"? "x" : "y";
  let html = `<div className="flex ${direction} gap-${gap_xy}-${getGapTwClassName(gapSize)}">`
  html += children[0].html;
  html += children[1].html;
  html += `</div>`;
  const newChildren: FrameSpaceInfo[] = [{
    height: newHeight,
    width: newWidth,
    padding: newPadding,
    html: html
  }].concat(children.slice(2));
  return mergeChildren([...newChildren], direction);
}

function groupLayout(node: FrameNode | TextNode, children: FrameSpaceInfo[], direction:string) {
    // make ordering to traverse and group first
  if (children.length === 0) { // if empty
    return ""
  }
  if (children.length === 1) { // if one size left
    return children[0].html; 
  }

  let spacingSizes = []; // store the spacing sizes, we want to group smallest ones together first 
    // stores a pair, the spacing size and the index i (the spacing is calcualted between the i and i-1)
  let visitedSpacingIndexes = new Map<number, boolean>();

  for (let i = 1; i < children.length; i++) {
    const spacingInPx = getSpacing(children[i-1], children[i], direction);      
    spacingSizes.push({
      spacingInPx, 
      pairEndIndex: i // end 
    });
  }

  spacingSizes.sort((s1, s2) => {
    if (s1.spacingInPx === s2.spacingInPx) {
      return s1.pairEndIndex - s2.pairEndIndex;
    }
    return s1.spacingInPx - s2.spacingInPx;
  }); // sort the sizes

  console.log("my spacing sizes " , children, direction, spacingSizes); // debug

  let groupRanges = []; // stores {l, r} pairs, l representing left most index, and r representing right most
                        // ranges are inclusive
  const parentLength = direction === "flex-row"? node.width : node.height;

  for (const spacingSize of spacingSizes) {

    let rangeStartIndex = spacingSize.pairEndIndex - 1;
    let rangeLastIndex = spacingSize.pairEndIndex;
    let previousSpacing = spacingSize.spacingInPx;

    if (visitedSpacingIndexes.has(rangeLastIndex)) {
      if (rangeStartIndex === 0 && !visitedSpacingIndexes.has(rangeStartIndex)) {
        visitedSpacingIndexes.set(rangeStartIndex, true);
        groupRanges.push({
          l: rangeStartIndex,
          r: rangeStartIndex,
          gapSize: 0,
        });
      }
      continue;
    }

    if (visitedSpacingIndexes.has(rangeStartIndex)) {
      if (spacingSize.pairEndIndex === spacingSizes.length - 1) {
        groupRanges.push({
          l: spacingSizes.length - 1,
          r: spacingSizes.length - 1,
          gapSize: 0,
        });
        continue;
      }
      rangeStartIndex = spacingSize.pairEndIndex;
      previousSpacing = getSpacing(children[rangeStartIndex - 1], children[rangeStartIndex], direction);
    }
    // console.log("----------------------------------------")
    // console.log("previous spacing", previousSpacing);

    for (let i = rangeStartIndex + 1; i < children.length; i++) {
      const currentSpacing = getSpacing(children[i-1], children[i], direction);

      //console.log("current spacing", currentSpacing, i-1, i);
      if (!visitedSpacingIndexes.has(i) && isSimilarSpacing(previousSpacing, currentSpacing, parentLength, 0.1)) {
        visitedSpacingIndexes.set(i, true);
        rangeLastIndex = i;
        // console.log("last segment ", rangeLastIndex)
      } else {
        break;
      }
    }

    // console.log("----------------------------------------")
    visitedSpacingIndexes.set(rangeStartIndex, true);

    groupRanges.push({
      l: rangeStartIndex,
      r: rangeLastIndex,
      gapSize: spacingSize.spacingInPx,
    });
  }

  // sort inc order by left index
  groupRanges.sort((r1, r2) => {
    return r1.l - r2.l;
  });

  console.log("my group ranges", groupRanges);
  // sanity check
  let overlappingRanges = false;
  for (let i = 0; i < groupRanges.length - 1; i++) {
    if (groupRanges[i].r > groupRanges[i + 1].l) {
      overlappingRanges = true;
      break;
    }
  } 
  if (overlappingRanges) {
    for (let i = 0; i < groupRanges.length; i++) {
      groupRanges[i].l = i;
      groupRanges[i].r = i;
    }
  }

  let groupedChildren = [];
  for (const range of groupRanges) {
    if (range.l == range.r) { // if only consisted of one element
      groupedChildren.push({
        height: children[range.l].height,
        width: children[range.l].width,
        padding: children[range.l].padding,
        html: children[range.l].html,
      });
      continue;
    }
    const gap_xy = direction === "flex-row"? "x" : "y";
    let html = `<div className="flex ${direction} gap-${gap_xy}-${getGapTwClassName(range.gapSize)}">`
    let newPadding = children[range.l].padding;
    let newHeight = 0;
    let newWidth = 0;

    for (let i = range.l; i <= range.r; i++) {
      newPadding = getMinPadding(newPadding, children[i].padding);
      
      newWidth += children[i].width;
      newHeight += children[i].height;
      
      if (i > range.l && direction === "flex-row") {
        newWidth += getHorizontalSpacing(children[i-1], children[i]);
      }
      if (i > range.l && direction == "flex-col") {
        newHeight += getVerticalSpacing(children[i-1], children[i]);
      }
      html += children[i].html;
    }
    html += "</div>"; // add closing bracket
    groupedChildren.push({
      height: newHeight,
      width: newWidth,
      padding: newPadding,
      html: html,
    }); 
  }
  // console.log("my final grouped childrens", groupedChildren);
  return mergeChildren(groupedChildren, direction);
}

async function serializeLayout(
  node: FrameNode,
  imports: string,
  hooks: string,
  formMap: Record<string, boolean>
) {
  if (!("children" in node)) {
    console.error("logic error: layouts should have children");
    throw "logic error: layouts should have children";
  }
  type NodeWithPadding = {
    node: FrameNode | TextNode;
    padding: FrameChild;
  }
  const className = getLayoutClassname(node);
  const nodeInfo = getFrameInfo(node);
  const direction = determineFlexDirection(nodeInfo);
  
  let children: NodeWithPadding[] = []; // get all the info
 
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type == 'TEXT' || child.type == 'FRAME') {
      children.push({
        node: child,
        padding: nodeInfo.childrenPadding[i],
      });
    }
  }

  children.sort((c1, c2) => {
    if (direction == "flex-col") {
      return c1.padding.topPadding - c2.padding.topPadding;
    } else {
      return c1.padding.leftPadding - c2.padding.leftPadding;
    }
  });
  
  // getting the html code for all of the children 
  // get the spacing info of all of the children
  let childrenSpacing: FrameSpaceInfo[] = [];

  for (const child of children) {
    const text = await traverse(child.node, node, imports, hooks, formMap);
    childrenSpacing.push({
      width: child.node.width,
      height: child.node.height,
      padding: {
        leftPadding: child.padding.leftPadding,
        rightPadding: child.padding.rightPadding,
        topPadding: child.padding.topPadding,
        bottomPadding: child.padding.bottomPadding,
      },
      html: text,
    })
  }

  const childrenHTML = groupLayout(node, childrenSpacing, direction);

  // console.log("my children with parent node", node, childrenHTML);

  return `<div className="${className}"> ${childrenHTML} </div>`;
}

/*
    Gets the HTML needed for a text element
    eg. text node -> <h1 className="text-4xl">hello</h1>
  */
async function serializeText(
  node: TextNode,
  formMap: Record<string, boolean>
): Promise<string> {
  const info = getTextInfo(node);
  const type = await classifyText(info);
  const textClassName = getTextClassname(info, type);

  if (formMap[node.id] === true) {
    if (type === TextType.BODY) {
      return `<p className="${textClassName}">\${${node.name}}</p>`;
    } else if (type === TextType.HEADING) {
      // console.log("[info]", info.relativeFontSizeRank.rank);
      const headingRank = info.relativeFontSizeRank.rank + 1;
      return `<h${headingRank} className="${textClassName}">\${${node.name}}</h${headingRank}>`;
    }
  }

  if (type === TextType.BODY) {
    return `<p className="${textClassName}">${info.text}</p>`;
  } else if (type === TextType.HEADING) {
    // console.log("[info]", info, info.relativeFontSizeRank.rank);
    const headingRank = info.relativeFontSizeRank.rank + 1;
    return `<h${headingRank} className="${textClassName}">${info.text}</h${headingRank}>`;
  }
  return "";
}

function getFormTextPlaceholder(node: FrameNode): string {
  let returnedString = node.children.reduce((prev: string, cur: SceneNode) => {
    if (cur.type == "TEXT") {
      if (prev != "") {
        prev += " ";
      }
      return prev + cur.characters;
    }
    return prev;
  }, "");
  return returnedString;
}

async function serializeBasicFrame(
  node: FrameNode,
  imports: string,
  hooks: string
): Promise<string> {
  const info = getFrameInfo(node);
  const type = await classifyFrame(info);
  const frameClassName = await getBasicFrameClassname(info, type);
  /* make this into a map later if i have time */
  if (type === BasicFrameType.FORM_FIELD) {
    const className = getBasicFrameClassname(info, type);
    if (
      !imports.includes(`import { Input } from "@/components/ui/input"
      `)
    ) {
      imports += `import { Input } from "@/components/ui/input"`;
    }
    const nameOfFrame = node.name;
    if (!nameOfFrame.startsWith("set-")) {
      return `<Input type="text" placeholder="${getFormTextPlaceholder(
        node
      )}" className="${className}"/>`;
    }
    return `<Input type="text" placeholder="${getFormTextPlaceholder(node)}" className="${className}" />`;
  } else {
    const variant = getVariantForButton(type);
    const className = getBasicFrameClassname(info, type);
    //add button import if it's not imported already
    if (
      !imports.includes(`import { Button } from "@/components/ui/button"
      `)
    ) {
      imports += `import { Button } from "@/components/ui/button \n`;
    }
    const child = node.children[0];
    let content: string = "";
    if (child && child.type == "TEXT") {
      content = child.characters;
    }
    return `<Button variant="${variant}" className="${className}">${content}</Button>`;
  }
}

/*
    makes API call to cohere 
  */
async function classifyText(node: TextInfo): Promise<TextType> {
  const res: any = await classify(node);
  const prediction = res.classifications[0].prediction;
  console.log("predict res", res);
  switch (prediction) {
    case "heading":
      return TextType.HEADING
    case "body":
      return TextType.BODY
    default:
      const msg = `something went wrong, prediction was not a text type, instead was ${prediction}`;
      console.error(msg);
      throw msg;
  }
}
  
async function classifyFrame(node: FrameInfo): Promise<BasicFrameType> {
  const res: any = await classify(node);
  const prediction = res.classifications[0].prediction;
  // console.log("predict res", res);
  switch (prediction) {
    case "outline":
      return BasicFrameType.OUTLINE_BUTTON
    case "primary":
      return BasicFrameType.BASIC_BUTTON
    case "destructive":
      return BasicFrameType.DESTRUCTIVE_BUTTON
    case "input":
      return BasicFrameType.FORM_FIELD
    default:
      const msg = `something went wrong, prediction was not a basic frame type, instead was ${prediction}`;
      console.error(msg);
      throw msg;
  }
}

export { serializeBasicNode, serializeLayout };
