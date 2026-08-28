<?php
header('Content-Type: application/json; charset=utf-8');

// Return function
function jsonResponse($success, $msg = '') {
    echo json_encode(['success' => $success, $error => null, 'error' => $msg]); // fallback - updated below
    exit;
}

// Better structured response:
function respond($ok, $msg = '') {
    echo json_encode(['success' => $ok, 'error' => $ok ? null : $msg]);
    exit;
}

// Simple helper to sanitize string input
function clean($v) {
    return trim(htmlspecialchars($v, ENT_QUOTES, 'UTF-8'));
}

// Get POST data
$name    = isset($_POST['name']) ? clean($_POST['name']) : '';
$email   = isset($_POST['email']) ? clean($_POST['email']) : '';
$phone   = isset($_POST['phone']) ? clean($_POST['phone']) : '';
$message = isset($_POST['message']) ? clean($_POST['message']) : '';
$monthlyIncome = isset($_POST['monthlyIncome']) ? clean($_POST['monthlyIncome']) : '';
$cibilScore = isset($_POST['cibilScore']) ? clean($_POST['cibilScore']) : '';
$loanAmount = isset($_POST['loanAmount']) ? clean($_POST['loanAmount']) : '';
$employmentType = isset($_POST['employmentType']) ? clean($_POST['employmentType']) : '';
$cityState = isset($_POST['cityState']) ? clean($_POST['cityState']) : '';

// Server-side validation
if (!$name || strlen($name) < 2 || strlen($name) > 100) {
    respond(false, 'Invalid name.');
}

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}

if ($phone) {
    // allow digits, spaces, + and -
    if (!preg_match('/^\+?[0-9\-\s]{7,20}$/', $phone)) {
        respond(false, 'Invalid phone number.');
    }
}

if (!$message || strlen($message) < 10 || strlen($message) > 2000) {
    respond(false, 'Message must be between 10 and 2000 characters.');
}

// At this point data is sanitized/validated. Now send mail with PHPMailer.
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$mail = new PHPMailer(true);
try {
    // SMTP config - update with your SMTP server
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // e.g. smtp.gmail.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your@email.com';      // your SMTP username
    $mail->Password   = 'your_app_password';   // use app password for Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // or 'tls'
    $mail->Port       = 587;

    // From / To
    $mail->setFrom('noreply@yourdomain.com', 'Website Contact'); // set a domain email here
    $mail->addReplyTo($email, $name); // allow reply-to user's email
    $mail->addAddress('receiver@yourdomain.com', 'Receiver Name');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New contact form submission';
    $body = "<h3>Contact form</h3>
             <p><strong>Name:</strong> {$name}</p>
             <p><strong>Email:</strong> {$email}</p>
             <p><strong>Phone:</strong> {$phone}</p>
             <p><strong>Message:</strong><br>" . nl2br($message) . "</p>";
    $mail->Body = $body;

    $mail->send();
    respond(true, '');
} catch (Exception $e) {
    // Do not leak SMTP credentials or sensitive details in production
    respond(false, 'Mail could not be sent. Error: ' . $mail->ErrorInfo);
}