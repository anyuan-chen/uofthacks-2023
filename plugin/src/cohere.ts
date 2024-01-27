
import { parseFrameInfoIntoEnglish, parseTextInfoIntoEnglish } from "./util";

const modelID = "7d73f5ea-6154-4f14-b335-6bafbb293cfd-ft";
const API_KEY = "ky2oBXDRar21mV4c35C0EADVRx4lBzOeQOpVIdAM";

export const classify = async (node: FrameNode | TextNode) => {
    const text = node.type === 'FRAME'? parseFrameInfoIntoEnglish(node) : parseTextInfoIntoEnglish(node);
    const body = {
        model: modelID,
        inputs: [text],
    }
    const req = await fetch("https://api.cohere.ai/v1/classify", {
        method: "POST",
        headers: {
            'content-type': 'application/json', 
            'Authorization': `BEARER ${API_KEY}`
        },
        body: JSON.stringify(body)
    })
    const data = await req.json()
    return data;
}
