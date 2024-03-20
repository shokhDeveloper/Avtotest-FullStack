import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { createToken } from "./createToken.js";
const handler = {}
let staticPath = ''
const Server = (req, res) => {
    const SERVER_URL_COSTRUCTOR = new URL(req.url, `http://${req.headers.host}`)
    const reqUrl = SERVER_URL_COSTRUCTOR.pathname.toLowerCase();
    const reqMethod = req.method.toUpperCase();
    let searchParams = SERVER_URL_COSTRUCTOR.searchParams.entries();
    searchParams = Object.fromEntries(searchParams);
    req.searchParams = Object.keys(searchParams)?.length ? searchParams: null;

    res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

    if(reqMethod === "OPTIONS") return res.end("")
    if(staticPath){
        req.staticPath = staticPath;
    }

    res.addToDatabase = async function(jsonFileName, data){
        await fs.writeFile(path.join(staticPath, "database", jsonFileName + ".json" ), JSON.stringify(data, null, 4))
    }

    res.setJson = function(statusCode, data){
        res.writeHead(statusCode, {"Content-type": "application/json"});
        res.end(JSON.stringify(data))
    }
    
    res.register = function(reqBody, users){
        let user = {
            accessToken: createToken(),
            user: {...reqBody, gameSettings: [], userId: users.length ? users[users.length-1].user.userId + 1: 1},
        }
        users.push(user)
        res.addToDatabase("users", users )
        res.setJson(201, {message: "User successfull register", user, statusCode: 201})
    }
    if(reqMethod == "POST"){
        req.body = new Promise((resolve) => {
            let data = '';
            req.on("data", (buffer) => data += buffer );
            req.on("end", () => {
                if(data){
                   console.log(data, "POTSSSSS")
                    resolve(JSON.parse(data))
                }
            })
        })
    }
    const params = {};
    for(let key in handler ){
        if("path" in handler[key]) {
            if(isMatchedWithRegex(handler[key].path, reqUrl)){
                let keys = key.split("/:").filter(e => e !== "").slice(1);
                let values = reqUrl.split("/").filter(e => e !== "").slice(1);
                keys.map((key, index) => params[key] = values[index] )
                req.params = params ;
                if(typeof handler[key][reqMethod] == "function"){
                    return handler[key][reqMethod](req, res)
                }else{
                    return res.end("XATOLIK")
                }
            }
        }
    }

    if(handler[reqUrl]){
        return handler[reqUrl][reqMethod](req, res)
    }else{
       return res.end(`Cannot ${reqUrl}/ ${reqMethod}  `)
    }

}
function isMatchedWithRegex(regex, path) {
    path += path[path.length-1] == "/" ? "": "/";
    console.log(regex, path, regex.test(path) )
    return regex.test(path)
}
function RegexGenerator(reqUrl){
    let str = ''
    let params = "\\b.*?/";
    let ind = false;
    for(let i = 0; i<reqUrl.length; i++){
        if(reqUrl[i]  == ":"){
            str += params;
            ind = true
        }else if(reqUrl == "/" && ind) {
            ind = false;
        }else if(ind){
            continue;
        }else{
            str += reqUrl[i]
        }
    }
    let regex = new RegExp(str, "gis")
    return regex
}
function isPathWithParams(reqUrl) {
   const regex = /:.*?/
   return regex.test(reqUrl)   
}
export class Express {
    constructor(){
        this.server = http.createServer(Server);
        this.staticPath = function(path) {
            staticPath = path
        }
        this.request = function(reqUrl, callBackHandler, reqMethod){
            handler[reqUrl] = handler[reqUrl] || {};
            handler[reqUrl][!reqMethod ? "GET": reqMethod] = callBackHandler;   
            if(isPathWithParams(reqUrl)) handler[reqUrl]["path"] = RegexGenerator(reqUrl)     
        }
        this.listen = function (PORT, callBackHandler){
            this.server.listen(PORT, callBackHandler)
        }
    }
}