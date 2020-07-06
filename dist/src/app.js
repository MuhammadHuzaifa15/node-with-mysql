"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const http_1 = __importDefault(require("http"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../config/db"));
const cookie = require("cookie-parser");
const cors = require("cors");
class App {
    constructor(controllers, port) {
        this.partialsPath = "views/emailTemplates/partials";
        this.app = express_1.default();
        this.port = port;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.registerPartials();
    }
    initializeMiddlewares() {
        this.app.use(body_parser_1.default.json());
        this.app.use(cors());
        this.app.use(passport_1.default.initialize());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(cookie());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    listen() {
        const server = http_1.default.createServer(this.app);
        server.listen(this.port, () => console.log(`Server started on port ${this.port}`));
    }
    connectToDatabase() {
        db_1.default();
    }
    registerPartials() {
        const registerHandlebarsPartial = (name, filename = null) => {
            handlebars_1.default.registerPartial(name, handlebars_1.default.compile(fs_1.default.readFileSync(path_1.default.join(__dirname, this.partialsPath, `${filename || name}.html`), "utf8")));
        };
        registerHandlebarsPartial("header");
        registerHandlebarsPartial("footer");
    }
}
exports.default = App;
