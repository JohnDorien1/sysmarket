<?php

//$defflip = (!cfip()) ? exit(header('HTTP/1.1 401 Unauthorized')) : 1;

$config = array();
$config['version'] = '0.0.8';


$config['db']['host'] = 'localhost';
$config['db']['user'] = 'sysmarket';
$config['db']['pass'] = 'sysmarket1';
$config['db']['port'] = 3306;
$config['db']['name'] = 'items';

$config['cookie']['duration'] = '1440';
$config['cookie']['domain'] = '';
$config['cookie']['path'] = '/';
$config['cookie']['httponly'] = true;
$config['cookie']['secure'] = false;

?>