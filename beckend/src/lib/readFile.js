import fs from "node:fs/promises";
import path from "node:path";
export const readFile = async (fileName, isParsed = false) => {
    try{
        let fileData = await fs.readFile(path.join(process.cwd(), "database", `${fileName}.json`))
        fileData = isParsed ? JSON.parse(fileData || "[]"): fileData
        return fileData
    }catch(error){
        console.log(error.message)
    }
}
export const userType = {
    name: "",
    firstName: "",
    email: "",
    password: "",
    gender: ""
}