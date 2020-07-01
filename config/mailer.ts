import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = (mailOptions: any) => {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("Email failed!", JSON.stringify(err));
    }
  });
};

export default sendMail;
