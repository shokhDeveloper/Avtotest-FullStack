import path from "node:path";
import { PORT, host } from "./lib/network.js";
import { Express } from "./lib/router.js";
import { authController } from "./controller/auth.js";
import { roadsController } from "./controller/roads.js";
import { userController } from "./controller/user.js";
const app = new Express();

app.staticPath(path.join(process.cwd()));

app.request("/register", authController.POST.REGISTER, "POST");

app.request("/login", authController.POST.LOGIN, "POST");

app.request("/roads", roadsController.GET);

app.request("/users/:userId", authController.DELETE, "DELETE");

app.request("/users", userController.GET);

app.request("/users/:userId/:gameType", userController.POST, "POST")

app.listen(PORT, () => {
  console.log(`Server is running ${host}`);
});
