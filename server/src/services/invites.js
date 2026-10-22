const crypto = require("crypto");
const dayjs = require("dayjs");
const { appUrl, inviteDays } = require("../config/env");
const { sendTemplate } = require("../utils/mailer");

/**
 * Gives the user a fresh set-password link and emails it.
 * The link is also returned, so an admin can copy it if email isn't set up.
 */
async function sendInvite(user, { transaction } = {}) {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = dayjs().add(inviteDays, "day");

  await user.update({ set_token: token, set_token_expires_at: expiresAt.toDate() }, { transaction });

  const link = `${appUrl}/set-pass/${token}`;
  const emailSent = await sendTemplate({
    to: user.email,
    subject: "Set up your attendance account",
    template: "invite",
    data: { name: user.full_name, link, expires: expiresAt.format("D MMMM YYYY, HH:mm") },
  });

  return { link, emailSent, expiresAt: expiresAt.toDate() };
}

module.exports = { sendInvite };
