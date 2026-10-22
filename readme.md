# Attendance System

A small attendance and payroll app for an office. Staff clock in when they arrive and clock out when they leave. At the end of the month the app works out everyone's pay from their attendance. An admin adds new staff and keeps an eye on who's in.

## What it does

**Staff can**

- clock in and clock out from the browser (Monday to Friday)
- see their month as a calendar, coloured by full days, half days and absences
- filter the list of days by status and see how long they worked each day
- read their payslips, with deductions shown
- see their profile and basic salary

**Admins can**

- see who's in today: who's still working, who's done and who hasn't shown up, for any day
- add a new staff member. They get an email with a link to choose their password.
- send a fresh setup link if the old one expired or got lost
- open any staff member's attendance month by month

**How a day is counted**

| What happened | Status | Pay for that day |
| --- | --- | --- |
| Clocked in and out | Full day | full day's pay |
| Clocked in, never clocked out | Half day | half, the other half is deducted |
| Didn't clock in by 22:00 | Absent | nothing, the whole day is deducted |

A day's pay is the monthly basic salary divided by the number of workdays (Monday to Friday) in that month. Payroll runs automatically at 23:00 on the last day of each month. Public holidays aren't handled yet.

## Quick start with Docker

You only need [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or OrbStack). Make sure it's running, then:

```bash
docker compose up --build
```

The first run takes a few minutes. When the logs settle down, open:

| What | Address |
| --- | --- |
| The app | http://localhost:3100 |
| The API | http://localhost:8100/api |
| Test inbox (emails the app sends) | http://localhost:8026 |
| MySQL | `localhost:3308`, user `attendance`, password `attendance` |

These ports are different from the Online Library project, so you can run both at the same time.

You don't need a `.env` file for this. The defaults are already in `docker-compose.yml`.

On first start the database gets demo data. All demo accounts use the password **`Password12!`**:

| Email | Role | What's already set up |
| --- | --- | --- |
| `admin@example.com` | Admin | sees the whole team |
| `staff1@example.com` | Staff (Rina) | three months of attendance and payslips, rarely absent |
| `staff2@example.com` | Staff (Budi) | same, with a few more absences |
| `sari@example.com` | Staff (Sari) | hasn't set up her account yet |

The login page has buttons that log you in as the admin or as Rina in one click. Today is left empty for the demo staff, so you can try clocking in yourself, on a weekday.

To try the invite flow, open http://localhost:3100/set-pass/demo-invite-link. That's Sari's setup link. Or add a new staff member as admin and open the email in the test inbox.

To stop the app, press `Ctrl+C`, or run `docker compose down`. To wipe the database and start over:

```bash
docker compose down -v
docker compose up --build
```

## Changing settings

All settings live in one `.env` file at the root of the project. Make your own copy first:

```bash
cp .env.example .env
```

Then change what you need and run `docker compose up --build` again. The ones you're most likely to touch:

| Setting | Default | What it's for |
| --- | --- | --- |
| `CLIENT_PORT` | `3100` | where the website opens |
| `API_PORT` | `8100` | where the API listens |
| `DB_PORT` | `3308` | MySQL port on your machine |
| `APP_TIMEZONE` | `Asia/Jakarta` | decides what "today" is and when weekends and month ends happen |
| `JWT_SECRET` | dev value | secret used to sign login tokens. Use something long and random (`openssl rand -hex 32`). |
| `JWT_EXPIRES_IN` | `8h` | how long a login lasts |
| `INVITE_VALID_DAYS` | `3` | how long a setup link keeps working |
| `DOCKER_APP_URL` | `http://localhost:3100` | the address put in invite emails. Change it if you change `CLIENT_PORT`. |
| `SEED_DEMO_DATA` | `true` | set to `false` to start with just the admin account |

Seeders only run once per database. If you change `SEED_DEMO_DATA` after the first start, wipe the database (`docker compose down -v`) for it to take effect.

### Email

Invite emails go to [Mailpit](http://localhost:8026) by default, so you can read them without setting anything up. If sending fails, adding a staff member still works, and the admin gets the setup link on screen to copy.

To send real email, fill in the SMTP settings in `.env`. For Gmail, `SMTP_USER` is your full Gmail address and `SMTP_PASSWORD` is an [App Password](https://support.google.com/accounts/answer/185833), not your normal password.

## Running without Docker (for development)

This gives you hot reload on both sides. You'll need Node.js 22 or newer. MySQL still runs in Docker because that's the easiest way to get it:

```bash
cp .env.example .env
npm run setup
npm run db
npm run db:setup
npm run dev
```

The commands, in order:

1. `npm run setup` installs packages for the root, server and client.
2. `npm run db` starts MySQL and Mailpit in Docker. Wait until `docker compose ps` shows `db` as `healthy` before the next step.
3. `npm run db:setup` creates the tables and adds the demo data.
4. `npm run dev` starts the API and the React dev server.

Then open http://localhost:5174. The dev server forwards `/api` to the API on port 8100.

If you'd rather use a MySQL you already have, create an empty database and set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` in `.env` before `npm run db:setup`.

| Command | What it does |
| --- | --- |
| `npm run db:reset` | undoes every migration, then runs them and the seeders again |
| `npm run build` | builds the React app into `client/dist` |
| `npm start` | runs the API. If `client/dist` exists it serves the website too, all on port 8100. |

## Project layout

```
.
├── docker-compose.yml     MySQL, Mailpit, API and website
├── .env.example           every setting, with comments
├── client/                React app (Vite)
│   ├── src/pages/         staff/ and admin/ screens, plus login, setup and profile
│   ├── src/components/    month calendar, layout, forms
│   ├── src/lib/api.js     axios setup, adds the login token to every request
│   └── nginx.conf         serves the built app and forwards /api in Docker
└── server/                Express API
    ├── src/routes/        every endpoint, in one file
    ├── src/controllers/   what each endpoint does
    ├── src/services/      attendance history and invite links
    ├── src/schedule/      the nightly absent check and monthly payroll
    ├── src/utils/         workday maths, payroll formula, email
    ├── src/templates/     the invite email
    ├── src/migrations/    database changes, run in order
    └── src/seeders/       demo data
```

## API

Every endpoint is under `/api`. Endpoints that need a login expect an `Authorization: Bearer <token>` header. You get the token from `/api/auth/login`.

| Method | Path | Who | What it does |
| --- | --- | --- | --- |
| POST | `/auth/login` | anyone | `{ email, password }`, returns a token and the user |
| GET | `/auth/me` | logged in | profile with basic salary (`/auth/user-profile` also works) |
| GET | `/auth/invite/:token` | anyone | who a setup link belongs to (`/auth/profile?token=` also works) |
| POST | `/auth/set-pass` | anyone with a link | `{ token, password, confirm_password, full_name?, birth_date? }` |
| GET | `/staff/check-attendance` | staff | today's record and whether today is a workday |
| POST | `/staff/clock-in` | staff | clock in |
| PATCH | `/staff/clock-out` | staff | clock out |
| GET | `/staff/attendance/history` | staff | a month of attendance. Query: `year`, `month`, `status` (comma separated), `sort` (`ASC` or `DESC`) |
| GET | `/staff/payroll/history` | staff | payslips. Query: `year`, `month` (optional), `sort` (`date,ASC` or `date,DESC`) |
| POST | `/admin/register` | admin | add a staff member: `{ email, full_name, birth_date, join_date, salary }`. Returns the setup link. |
| GET | `/admin/users` | admin | all staff and their attendance on `?date=YYYY-MM-DD` (default today) |
| POST | `/admin/users/:id/invite` | admin | new setup link for someone who hasn't set up their account |
| GET | `/admin/users/:id/attendance` | admin | a staff member's month, same query as the staff history |
| GET | `/health` | anyone | returns ok if the API can reach the database |

Errors always come back as `{ "message": "..." }`, written so it can be shown straight to the user.

## What changed in the 2026 update

The update covers:

- **Client:** moved from Create React App to Vite. Also upgraded to React 19, React Router 7, Tailwind 4 and axios 1. Redux, Formik and Flowbite are gone. Every API call used to be hard-coded to `localhost:8000`.
- **UI:** full redesign. There's a big clock for clocking in, the month shown as a calendar, payslip cards and an admin view of who's in today. Admins can also see each person's month. It works on a phone.
- **Login:** you stay logged in after a refresh, and each page checks your role. Before, the role was fetched again on every page, and some routes briefly sent you away while it loaded.
- **Server:** upgraded to Express 5, nodemailer 7 and bcryptjs, and added helmet and request logging.
- **Bug fixes:**
  - Adding a staff member returned an error if the email failed, even though the person had already been created. The email also greeted them by an undefined username.
  - The setup-link lookup crashed when no token was given.
  - Requests with a malformed token header hung with no response.
  - Payroll and the absent check ran for the admin and for people who hadn't set up their account.
  - Payroll could run before the absent check on the last day of the month. It could also run twice and create duplicate payslips.
  - Admins could call the clock-in endpoints.
- **Time zone:** the server now always works in `APP_TIMEZONE`. Before, a server running in UTC would treat 07:00 Monday in Jakarta as Sunday.
- **Database:** a new migration stores work days, birthdays and join dates as dates without a time, and makes setup links expire. It also allows only one attendance row per person per day.
- **Setup:** Docker Compose for everything, one `.env` file, and Mailpit for test emails.

## Troubleshooting

**`Cannot connect to the Docker daemon`.** Docker Desktop isn't running. Open it (`open -a Docker` on a Mac), wait for it to start, and try again.

**"Port is already allocated".** Something else is using that port. Change `CLIENT_PORT`, `API_PORT` or `DB_PORT` in `.env`.

**The login page says it can't reach the server.** The API is probably still starting, or it couldn't connect to MySQL. Check `docker compose logs server`.

**The Clock in button is missing.** It's hidden on Saturdays and Sundays, and once today is already recorded. Make sure `APP_TIMEZONE` is right for where you are.

**The link in the invite email goes to the wrong address.** Set `DOCKER_APP_URL` (Docker) or `APP_URL` (`npm run dev`) to the address you open the site at.
