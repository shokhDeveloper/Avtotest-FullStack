"use strict";
const BECKEND_SERVER = "http://192.168.1.104:1000";
const simpleQueries = ["GET", "DELETE"];
const request = async (path, reqMethod, reqBody) => {
    const req = await fetch(BECKEND_SERVER + path, !simpleQueries.includes(reqMethod) ? {
        method: reqMethod,
        body: JSON.stringify(reqBody),
        headers: {
            "Content-type": "application/json"
        }
    } : { method: reqMethod });
    if (req.ok) {
        const res = await req.json();
        return res;
    }
};
