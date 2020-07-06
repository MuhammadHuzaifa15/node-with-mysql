"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mailer_1 = __importDefault(require("../../config/mailer"));
class Email {
    constructor(template, mailOptions, data) {
        this.emailTemplatesPath = "../views/emailTemplates";
        this.partialsPath = this.emailTemplatesPath + "/partials";
        this.layoutsPath = this.emailTemplatesPath + "/layouts";
        this.from = `${process.env.EMAIL_FROM_ADDR} <${process.env.EMAIL_USERNAME}>`;
        if (!template.toLowerCase().endsWith(".html")) {
            template = template + ".html";
        }
        const layout = fs_1.default.readFileSync(path_1.default.join(__dirname, this.layoutsPath, "index.html"), "utf8");
        const templateFile = fs_1.default.readFileSync(path_1.default.join(__dirname, this.emailTemplatesPath, template), "utf8");
        const email = layout.replace("{{>body}}", templateFile);
        this.template = handlebars_1.default.compile(email);
        this.data = data;
        this.mailOptions = mailOptions;
    }
    send() {
        mailer_1.default(Object.assign(Object.assign({}, this.mailOptions), { from: this.from, html: this.template(this.data) }));
    }
}
exports.Email = Email;
