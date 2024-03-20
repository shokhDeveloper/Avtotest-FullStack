import path from "node:path";
import { Express } from "./lib/router.js";
import { PORT, host } from "./lib/network.js";
const app = new Express();

app.static(path.resolve("src", "public"));

app.views(path.resolve("src", "public", "views"));

app.request("/register", (_, res) => res.render("sign.html"));

app.request("/", (_, res) => res.render());

app.request("/login", (_, res) => res.render("login.html"))

app.listen(PORT, () => {
  console.log(`Frontend Server is running ${host}`);
});
