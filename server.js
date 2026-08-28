// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== LOG MIDDLEWARE ====================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') console.log("  Body:", req.body);
  next();
});
// ========================================================


// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("LLW Loans Backend Running Successfully!");
});

// ============== Gmail Transport ===============
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// ========================================================
// 1️⃣ PERSONAL LOAN ENQUIRY ROUTE
// ========================================================
app.post("/send-personal-loan", async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      cityState,
      employmentType,
      monthlyIncome,
      cibilScore,
      loanAmount
    } = req.body;

    const mailOptions = {
      from: `Livelong Shield <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Personal Loan Enquiry — Livelong Shield",
      html: `
        <h2>New Personal Loan Enquiry</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City/State:</strong> ${cityState}</p>
        <p><strong>Employment Type:</strong> ${employmentType}</p>
        <p><strong>Monthly Income:</strong> ${monthlyIncome}</p>
        <p><strong>CIBIL Score:</strong> ${cibilScore}</p>
        <p><strong>Loan Amount Required:</strong> ${loanAmount}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Personal loan enquiry sent!" });

  } catch (error) {
    console.error("Personal Loan Mail Error:", error);
    res.status(500).json({ success: false, message: "Email sending failed!" });
  }
});


// ========================================================
// 1️⃣🔁 ALIAS ROUTES for OLD FORMS (must be below the main route)
// ========================================================
app.post(['/send-enquiry','/send-enquiry'], async (req, res) => {
  try {
    const {
      fullName, mobileNumber, email, cityState, employmentType,
      monthlyIncome, cibilScore, loanAmount
    } = req.body;

    const mailOptions = {
      from: `Livelong Shield <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Personal Loan Enquiry — Livelong Shield",
      html: `
        <h2>New Personal Loan Enquiry</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City/State:</strong> ${cityState}</p>
        <p><strong>Employment Type:</strong> ${employmentType}</p>
        <p><strong>Monthly Income:</strong> ${monthlyIncome}</p>
        <p><strong>CIBIL Score:</strong> ${cibilScore}</p>
        <p><strong>Loan Amount Required:</strong> ${loanAmount}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Personal loan enquiry sent (alias)" });

  } catch (err) {
    console.error('Alias Personal Mail Error:', err);
    res.status(500).json({ success: false, message: 'Email sending failed (alias)' });
  }
});


// ========================================================
// 2️⃣ BUSINESS LOAN ENQUIRY ROUTE
// ========================================================
app.post("/send-business-loan", async (req, res) => {
  const {
    fullName,
    mobileNumber,
    email,
    cityState,
    businessType,
    loanAmount,
    details,
  } = req.body;

  try {
    const mailOptions = {
      from: `"Website Enquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Secured Business Loan Enquiry Received",
      html: `
        <h2>New Business Loan Enquiry</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City/State:</strong> ${cityState}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Loan Amount:</strong> ${loanAmount}</p>
        <p><strong>Additional Details:</strong> ${details}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Business loan enquiry sent successfully!" });

  } catch (err) {
    console.error("Business Loan Mail Error:", err);
    res.status(500).json({ message: "Error sending email", error: err });
  }
});


// ========================================================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
