import { readFile } from "../lib/readFile.js"

export const roadsController = {
    GET: async (req, res) => {
        const signs = await readFile("sings", true);
        res.setJson(200, signs)
    }
}