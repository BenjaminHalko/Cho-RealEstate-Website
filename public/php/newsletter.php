<?php
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit;
}
mail('kittychosutton@gmail.com','Newsletter Signup Request',$_POST['email']);
echo 'Request sent successfully.';
?>