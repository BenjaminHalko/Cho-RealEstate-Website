<?php
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit;
}

$to = 'kittychosutton@gmail.com';
$subject = 'Newsletter Signup Request';
$message = 'Name: ' . $_POST['name'] . "\n" . 'Email: ' . $_POST['email'];
$headers = array(
    'From' => 'newsletter.signup@kittycho.ca'
);

mail($to, $subject, $message, $headers);
echo 'Request sent successfully.';
?>