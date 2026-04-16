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
        // Server settings
        // If SMTP is needed, uncomment and configure these lines
        // $mail->isSMTP();
        // $mail->Host       = 'smtp.example.com';
        // $mail->SMTPAuth   = true;
        // $mail->Username   = 'user@example.com';
        // $mail->Password   = 'secret';
        // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        // $mail->Port       = 465;

        // Use the native mail() function
        $mail->isMail();

        // Recipients
        $mail->setFrom('info@healtho.pro', 'HealthO Pro Form');
        $mail->addReplyTo($email, $fullName);
        
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
        echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully.']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'There was a problem with your submission, please try again.']);
}
?>
