<?php
 
// random string of characters; must match the "Secret" defined in your webhook
define('SECRET', 'XLzyjJQHpvoDiL61KwEd');

// END OF CONFIGURATION OPTIONS

try {
    if (is_null($_SERVER['HTTP_AUTHORIZATION']) || $_SERVER['HTTP_AUTHORIZATION'] != SECRET) {
        //die('go away');
    }

    // run the deploy script
    die(shell_exec('python ~/repository/instagram_api/fetch.py'));
} catch (Exception $e) {
    die("bad");
}

die("something else???");

?>