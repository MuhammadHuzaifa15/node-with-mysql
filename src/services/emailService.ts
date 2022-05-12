import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import sendMail from "../config/mailer";

interface IMailOptions {
  to: string;
  subject?: string;
}

class Email {
  public emailTemplatesPath: string = "../views/emailTemplates";
  public partialsPath: string = this.emailTemplatesPath + "/partials";
  public layoutsPath: string = this.emailTemplatesPath + "/layouts";

  public from: string = `${process.env.EMAIL_FROM_ADDR} <${process.env.EMAIL_USERNAME}>`;
  public template: any;
  public mailOptions: IMailOptions;
  public data: any;

  constructor(template: string, mailOptions: IMailOptions, data: any) {
    if (!template.toLowerCase().endsWith(".html")) {
      template = template + ".html";
    }

    const layout = fs.readFileSync(
      path.join(__dirname, this.layoutsPath, "index.html"),
      "utf8"
    );

    const templateFile = fs.readFileSync(
      path.join(__dirname, this.emailTemplatesPath, template),
      "utf8"
    );

    const email = layout.replace("{{>body}}", templateFile);

    this.template = handlebars.compile(email);
    this.data = data;
    this.mailOptions = mailOptions;
  }

  send() {
    sendMail({
      ...this.mailOptions,
      from: this.from,
      html: this.template(this.data),
    });
  }
}

export { Email };
