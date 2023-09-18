import fs from 'fs/promises';
import handlebars from 'handlebars';
import { htmlToText } from 'html-to-text';
import mjml from 'mjml';
import nodemailer from 'nodemailer';
import path from 'path';

const createTransporter = () => {
  console.log(process.env.EMAIL_HOST);

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ fileName, payload, subject, to }) => {
  // step 1: read mjml file
  const filePath = path.resolve(`./src/mjml/emails/${fileName}`);
  const rawMjml = await fs.readFile(filePath, { encoding: 'utf-8' });

  // step 2: use handlebars to inject dynamic variables into mjml template
  const compiledTemplate = handlebars.compile(rawMjml);
  const renderedTemplate = compiledTemplate(payload);

  // step 3: convert mjml to html
  const { html } = mjml(renderedTemplate, {
    filePath,
  });
  const text = htmlToText(html);

  // step 4: send actual email using nodemailer
  const transporter = createTransporter();

  if (!transporter) {
    return console.log('Email transporter is undefined!');
  }
  try {
    transporter.sendMail(
      {
        from: {
          name: process.env.EMAIL_NAME,
          address: process.env.EMAIL_FROM,
        },
        to,
        subject,
        html,
        text,
      },
      (error, info) => {
        if (error) console.log(error);
        if (info) console.log(info);
      },
    );
  } catch (err) {
    console.log(err);
  }
};
export { sendEmail };
