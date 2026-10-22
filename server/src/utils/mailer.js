const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { mail } = require("../config/env");

let transporter = null;
if (mail.host) {
  transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.port === 465,
    auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
  });
}

const templates = {};
function render(name, data) {
  if (!templates[name]) {
    const file = path.join(__dirname, "..", "templates", `${name}.html`);
    templates[name] = handlebars.compile(fs.readFileSync(file, "utf-8"));
  }
  return templates[name](data);
}

/**
 * Sends an email from a template in src/templates.
 * Returns true if it was sent. Never throws, so a mail problem can't break a request.
 */
async function sendTemplate({ to, subject, template, data }) {
  if (!transporter) {
    console.log(`[mail] SMTP not configured, skipped "${subject}" to ${to}`);
    return false;
  }
  try {
    await transporter.sendMail({ from: mail.from, to, subject, html: render(template, data) });
    return true;
  } catch (error) {
    console.error(`[mail] Could not send "${subject}" to ${to}:`, error.message);
    return false;
  }
}

module.exports = { sendTemplate };
