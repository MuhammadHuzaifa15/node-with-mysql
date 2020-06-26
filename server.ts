import App from "./src/app";
import UserController from "./src/controllers/User";
const CONFIG = require("./config/config");

const port = CONFIG.port || 5000;
const app = new App([new UserController()], port);

app.listen();
