import path from "node:path";
import { PORT, host } from "./lib/network.js";
import { Express } from "./lib/router.js";
import { readFile } from "./lib/readFile.js";
import { authController } from "./controller/auth.js";

const app = new Express();

app.staticPath(path.join(process.cwd()))

app.request("/register", authController.POST.REGISTER, "POST");

app.request("/login", authController.POST.LOGIN, "POST");

app.request("/users/:userId", authController.DELETE, "DELETE");

app.request("/users", async (req, res) => {
    const users = Array.from(await readFile("users", true)).map(({user}) => user);
    const searchParams = req.searchParams;
    if(!!searchParams && typeof searchParams == "object"){
        const store = [];
        for (const user of users) {
            let counter = 0;
            for(let key in searchParams){
                if(searchParams[key] == user[key]) counter ++
            }
            if(Object.keys(searchParams).length == counter) store.push(user);
        }
        if(store.length){
            res.setJson(200, store)
        }else{
            res.setJson(400, {message: "Users or user Not found, search params invalid !", statusCode: 400, search: searchParams })
        }
    }else{
        res.setJson(200, users)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running ${host}`)
})