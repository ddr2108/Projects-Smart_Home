<?php
#Checks if particular unit is activelly loged in
#
#parameters:
#       unit - unit num
#returns: 
#	1 if active, else 0

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

//Get device numbers
$result = mysqli_query($con,"SELECT * FROM Users WHERE Unit='$unit' AND Active='1'");

if($result->num_rows>0){
	echo '1';
}else{
	echo '0';
}


?>
