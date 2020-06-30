import bodyParser from "body-parser";
import express, { Application } from "express";
import fs from "fs";
import handlebars from "handlebars";
import http from "http";
import passport from "passport";
import path from "path";
import connectDb from "../config/db";
import IController from "./interfaces/Controller";


const cookie = require("cookie-parser");
const cors = require("cors");


class App {
  public app: Application;
  public port: any;
  public partialsPath: string = "views/emailTemplates/partials";

  constructor(controllers: IController[], port: any) {
    this.app = express();
    this.port = port;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.registerPartials();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(passport.initialize());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookie());
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    const server = http.createServer(this.app);
    server.listen(this.port, () =>
      console.log(`Server started on port ${this.port}`)
    );
  }

  private connectToDatabase() {
    connectDb();
  }

  private registerPartials() {
    const registerHandlebarsPartial = (
      name: string,
      filename: string | null = null
    ) => {
      handlebars.registerPartial(
        name,
        handlebars.compile(
          fs.readFileSync(
            path.join(__dirname, this.partialsPath, `${filename || name}.html`),
            "utf8"
          )
        )
      );
    };

    registerHandlebarsPartial("header");
    registerHandlebarsPartial("footer");
  }
}

export default App;
