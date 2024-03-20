import http from "node:http";
import fs from "node:fs/promises";
import fileStructure from "node:fs";

import path from "node:path";
const handler = {};
let viewsPath = null;
let staticPath = null;
const Server = (req, res) => {
  const SERVER_URL_COSTRUCTOR = new URL(req.url, `http://${req.headers.host}`);
  const reqUrl = SERVER_URL_COSTRUCTOR.pathname.toLowerCase();
  const reqMethod = req.method.toUpperCase();
  console.log(reqUrl);

  res.render = async function (fileName) {
    res.setHeader("Content-type", "text/html");
    let file = await await fs.readFile(
      path.join(viewsPath, fileName ? fileName : "index.html")
    );
    res.end(file);
  };

  if (handler[reqUrl]) {
    return handler[reqUrl][reqMethod](req, res);
  } else if (!handler[reqUrl] && reqMethod == "GET") {
    return renderFile(reqUrl, req, res);
  }

  if (!handler[reqUrl] && reqMethod !== "GET") {
    res.end("Not found");
  }
};

async function renderFile(reqUrl, req, res) {
  try {
    const extName = path.extname(reqUrl);
    const contentTypes = {
      ".js": "application/js",
      ".html": "text/html",
      ".css": "text/css",
      ".jpg": "image/jpeg",
    };
    if (contentTypes[extName]) {
      const contentType = { "Content-Type": contentTypes[extName] };
      let type = fileStructure.existsSync(path.join(staticPath, reqUrl));
      if (type) {
        res.writeHead(200, contentType);
        let file = await fs.readFile(path.join(staticPath, reqUrl));
        res.end(file);
        return true;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function RegexGenerator(reqUrl) {
  let str = "";
  let params = "\\b.*?/";
  let ind = false;
  for (let i = 0; i < reqUrl.length; i++) {
    if (reqUrl[i] == ":") {
      str += params;
      ind = true;
    } else if (reqUrl == "/" && ind) {
      ind = false;
    } else if (ind) {
      continue;
    } else {
      str += reqUrl[i];
    }
  }
  let regex = new RegExp(str, "gis");
  return regex;
}
function isPathWithParams(reqUrl) {
  const regex = /:.*?/;
  return regex.test(reqUrl);
}

// function

export class Express {
  constructor() {
    this.server = http.createServer(Server);
    this.static = function (path) {
      staticPath = path;
    };
    this.views = function (path) {
      viewsPath = path;
    };
    this.request = function (reqUrl, callBackHandler, reqMethod) {
      handler[reqUrl] = handler[reqUrl] || {};
      handler[reqUrl][!reqMethod ? "GET" : reqMethod] = callBackHandler;
      if (isPathWithParams(reqUrl))
        handler[reqUrl]["path"] = RegexGenerator(reqUrl);
    };
    this.listen = function (PORT, callBackHandler) {
      this.server.listen(PORT, callBackHandler);
    };
  }
}
