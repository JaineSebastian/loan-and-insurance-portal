# loan-and-insurance-portal

**Live:** https://jainesebastian.github.io/loan-and-insurance-portal/

Loans & insurance website for Livelong Wealth: static HTML pages for loan and insurance products, with a small Node.js backend that emails enquiry-form submissions.

## What's inside

- **Frontend** — static HTML/CSS pages: personal, business, home and term loans; health, life and vehicle insurance; CIBIL score improvement, debt settlement, EMI calculator, blog, and contact pages.
- **Backend** — `server.js`: Express server (port 5000) that receives enquiry-form POSTs and sends them by email via Nodemailer (Gmail).
- `mailer.php` — alternative PHP mailer (PHPMailer) for PHP hosting.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Gmail address and app password
npm start              # runs server.js on http://localhost:5000
```

Open `index.html` in a browser (or serve the folder with any static file server) for the frontend.

## Environment variables

| Variable     | Purpose                          |
| ------------ | -------------------------------- |
| `EMAIL_USER` | Gmail address that sends/receives enquiries |
| `EMAIL_PASS` | Gmail **app password** (not your normal password) |

Real credentials live only in `.env`, which is git-ignored.
