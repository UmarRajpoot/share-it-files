import nodemailer from "nodemailer";

async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER_EMAIL,
      pass: process.env.SMPT_USER_PASS,
    },
  });
  let info = await transporter.sendMail({
    from: `Share <${from}>`,
    to,
    subject,
    text,
    html,
  });

  //   console.log(info);
}

export default sendMail;
