import App from "./src/app";
import UserController from "./src/controllers/User";
import AuthController from "./src/controllers/Auth";
import FileController from "./src/controllers/File";
const CONFIG = require("./src/config/config");

const port = CONFIG.port || 5000;
const app = new App(
  [new FileController(), new UserController(), new AuthController()],
  port
);

app.listen();
