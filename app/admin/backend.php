<?php
require_once('config.php');
require_once('db_connect.php');

if(isset($_REQUEST))
{
$data = json_decode($_GET["data"]);
$title=$data->title; //$_POST['title'];
$category=$_POST['category'];
$quantity=$_POST['quantity'];
$price=$_POST['price'];

$sql = "INSERT INTO items values ($title, $category, $quantity, $price)";
        mysqli_query($mysqli, $sql);
}
?>
        
        