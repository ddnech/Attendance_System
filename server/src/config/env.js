const path = require("path");
const fs = require("fs");

// One .env file at the project root drives everything.
// Inside Docker there is no file, the values come from docker-compose instead.
const rootEnv = path.resolve(__dirname, "..", "..", "..", ".env");
const serverEnv = path.resolve(__dirname, "..", "..", ".env");
const envFile = [serverEnv, rootEnv].find((file) => fs.existsSync(file));
if (envFile) {
  require("dotenv").config({ path: envFile, quiet: true });
}

// "Today", weekends and payroll months all depend on the time zone,
// so set it before anything else creates a Date.
process.env.TZ = process.env.APP_TIMEZONE || process.env.TZ || "Asia/Jakarta";

/** "+07:00" style offset for the current time zone, used by MySQL. */
function currentOffset() {
  const minutes = -new Date().getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.API_PORT || process.env.PORT || 8100),
  timezone: process.env.TZ,
  appUrl: (process.env.APP_URL || "http://localhost:5174").replace(/\/$/, ""),
  jwtSecret: process.env.JWT_SECRET || process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  inviteDays: Number(process.env.INVITE_VALID_DAYS || 3),
  db: {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "attendance",
    username: process.env.DB_USER || "attendance",
    password: process.env.DB_PASSWORD || process.env.DB_PASS || "attendance",
    timezone: process.env.DB_TIMEZONE || currentOffset(),
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.MAIL_FROM || "Attendance <no-reply@attendance.local>",
  },
};

if (!env.jwtSecret) {
  if (env.nodeEnv === "production") {
    throw new Error("JWT_SECRET is not set. Add it to your .env file.");
  }
  env.jwtSecret = "dev-only-secret-change-me";
  console.warn("JWT_SECRET is not set, using a throwaway dev secret.");
}

module.exports = env;
