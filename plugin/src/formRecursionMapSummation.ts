/*
    need to get ID of the text nodes that are affected
*/
const getFormMap = (node: FrameNode): Record<string, boolean> => {
    let map: Record<string, boolean> = {};
    if (node.name.startsWith("set-")) {
      const remainingString = node.name.substring(4);
      map[remainingString] = true;
    }
    for (const child of node.children) {
      if (child.type === "TEXT") {
      } else if (child.type === "FRAME") {
        //let childMp: Record<string, boolean> = getFormMap(node);
        // map = {
        //   ...map,
        //   ...childMp,
        // };
      }
    }
    return map;
  };   
  
  export default getFormMap;
  