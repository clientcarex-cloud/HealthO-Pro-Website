<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = isset($_POST['fullName']) ? strip_tags(trim($_POST['fullName'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $orgType = isset($_POST['orgType']) ? strip_tags(trim($_POST['orgType'])) : '';
    $interest = isset($_POST['interest']) ? strip_tags(trim($_POST['interest'])) : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    if (empty($fullName) || empty($email)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // PERMANENT SOLUTION: Native PHP Server Mail
        $mail->isMail();
        
        // IMPORTANT: For native PHP mail() to work reliably and avoid spam filters, 
        // the 'From' address MUST use the same domain as your website.
        $mail->setFrom('info@healtho.pro', 'HealthO Pro Form');
        $mail->addReplyTo($email, $fullName);
        
        // This sets the Return-Path (-f flag in sendmail), critical for many shared hosts like Hostinger/GoDaddy
        $mail->Sender = 'info@healtho.pro';
        
        $debugLog = '';
        $mail->SMTPDebug = 4;
        $mail->Debugoutput = function($str, $level) use (&$debugLog) {
            $debugLog .= htmlspecialchars($str) . "<br>";
        };

        // Where the form notifications should go
        $mail->addAddress('digicarelynx@gmail.com');
        $mail->addAddress('info@healtho.in');
        $mail->addAddress('info@healtho.pro');

        // Content
        $mail->isHTML(false);
        $mail->Subject = "New Contact Form Submission - HealthO Pro";
        
        $emailContent = "Name: $fullName\n";
        $emailContent .= "Email: $email\n";
        $emailContent .= "Phone: $phone\n";
        $emailContent .= "Organization Type: $orgType\n";
        $emailContent .= "Interested In: $interest\n\n";
        $emailContent .= "Message:\n$message\n";

        $mail->Body    = $emailContent;

        $mail->send();
        http_response_code(200);
        
        // If debug log is empty, mail() accepted it but gave no logs.
        if (empty($debugLog)) {
            $debugLog = "Mail function returned TRUE (Success form the PHP side), but no SMTP debug logs available because isMail() is being used. If emails aren't arriving, the Server's internal mail router is blocking them.";
        }

        echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully.', 'log' => $debugLog]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 
            'message' => "Server Mail Error: {$mail->ErrorInfo}",
            'log' => $debugLog
        ]);
    }
} else {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'There was a problem with your submission, please try again.']);
}
?>
