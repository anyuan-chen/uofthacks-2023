
import { FrameInfo, TextInfo } from "./types";
import { parseFrameInfoIntoEnglish, parseTextInfoIntoEnglish } from "./util";
import { modelID, API_KEY } from "../env";

export const classify = async (nodeInfo: FrameInfo | TextInfo) => {
    const text = "text" in nodeInfo? parseTextInfoIntoEnglish(nodeInfo) : parseFrameInfoIntoEnglish(nodeInfo);
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
