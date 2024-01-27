import {
  determineFlexDirection,
  getBasicFrameClassname,
  getLayoutClassname,
  getTextClassname,
  getVariantForButton,
} from "./classNames";
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
  const className = getLayoutClassname(node);
  const nodeInfo = getFrameInfo(node);
  const direction = determineFlexDirection(nodeInfo);
  //getting the html code for all of the children
  let children: NodeWithPadding[] = [];
  type NodeWithPadding = {
    node: SceneNode;
    padding: FrameChild;
  };
  for (let i = 0; i < node.children.length; i++) {
    // console.log(
    //   `bad height at index ${i} `,
    //   array[i].height,
    //   nodeInfo.childrenPadding[i].node.height
    // );
    children.push({
      node: node.children[i],
      padding: nodeInfo.childrenPadding[i],
    });
  }

  children.sort((c1, c2) => {
    if (direction == "flex-col") {
      return c1.padding.topPadding - c2.padding.topPadding;
    } else {
      return c1.padding.leftPadding - c2.padding.leftPadding;
    }
  });


  // console.log(sorted);

  // const childrenHTMLBlocks = await Promise.all(
  //   sorted.map(async (childPaddingNode: NodeWithPadding) => {
  //     const child: SceneNode = childPaddingNode.node;
  //     if (child.type == "FRAME" || child.type == "TEXT") {
  //       const text = await traverse(child, imports, hooks, formMap);
  //       return text;
  //     }
  //     return Promise.resolve("");
  //   })
  // );

  // console.log(childrenHTMLBlocks);

  // const childrenHTML = childrenHTMLBlocks.reduce((prev, cur) => {
  //   return prev + cur;
  // }, "");

  let childrenHTMLArr = [];
  for (let i = 0; i < children.length; i++) {
    const child: SceneNode = children[i].node;
    if (child.type === "FRAME" || child.type === "TEXT") {
      const text = await traverse(child, imports, hooks, formMap);
      childrenHTMLArr[i] = text;
      // console.log(sorted[i].padding, childrenHTML)
    }
  }

  const childrenHTML = childrenHTMLArr.reduce((prev, cur) => {
    return prev + cur;
  }, "");

  // console.log(childrenHTML);

  // console.log(
  //   "sorted chidlren",
  //   sorted.map((child) => {
  //     return child.padding;
  //   })
  // );

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
      return `<h${info.relativeFontSizeRank} className="${textClassName}">\${${node.name}}</h${info.relativeFontSizeRank}>`;
    }
  }

  if (type === TextType.BODY) {
    return `<p className="${textClassName}">${info.text}</p>`;
  } else if (type === TextType.HEADING) {
    return `<h${info.relativeFontSizeRank} className="${textClassName}">${info.text}</h${info.relativeFontSizeRank}>`;
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
    return `<Input type="text" placeholder=${getFormTextPlaceholder(
      node
    )} className="${className}" onChange={(e) => {
          set${node.name}(e.target.value);
        }}/>`;
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
  return TextType.BODY;
}
  
async function classifyFrame(node: FrameInfo): Promise<BasicFrameType> {
  return BasicFrameType.BASIC_BUTTON;
}

export { serializeBasicNode, serializeLayout };
