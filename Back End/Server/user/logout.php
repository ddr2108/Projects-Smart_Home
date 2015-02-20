<?php
#logs out a user
#
#parameters:
#       unit - unit num
#returns: none

header('Access-Control-Allow-Origin: *');  

#credentials file
$credentialsDBFile = "../credentialsDB";
$credentialsDB = explode("\n", file_get_contents($credentialsDBFile));

//DB parameters
$host = "localhost";
$unDB = $credentialsDB[0];
$pwDB = $credentialsDB[1];
$DB = "Smart_Home";

//get data from request
$unit = $_POST['unit'];

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB, $DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}

//Delete data
mysqli_query($con,"DELETE FROM Devices WHERE Unit='$unit'");

//Delete request
mysqli_query($con,"DELETE FROM Requests WHERE Unit='$unit'");

//Set inactive
mysqli_query($con, "UPDATE Users SET Active='0' WHERE Unit='$unit'");

?>
