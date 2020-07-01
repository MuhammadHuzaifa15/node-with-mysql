import App from "./src/app";
import UserController from "./src/controllers/User";
import AuthController from "./src/controllers/Auth";
const CONFIG = require("./config/config");

const port = CONFIG.port || 5000;
const app = new App([new UserController(), new AuthController()], port);

app.listen();
