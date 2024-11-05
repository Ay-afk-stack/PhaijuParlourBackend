import nodemailer from "nodemailer";
import envConfig from "../config/config";

interface IData {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (data: IData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envConfig.email,
      pass: envConfig.password,
    },
  });

  const mailOptions = {
    from: "Phaiju Parlour <pakhrinayush56@gmail.com>",
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
