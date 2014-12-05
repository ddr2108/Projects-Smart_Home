<?php
#logs in a user and sets active and request flags
#
#parameters:
#       un - username
#       pw - password
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
$un = $_POST['un'];
$pw = $_POST['pw'];

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB, $DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}

//Get device numbers
$resultUnits = mysqli_query($con,"SELECT * FROM Users WHERE UN='$un' AND PW='$pw'");
//go through and see if there is a unit
while ($row = mysqli_fetch_array($resultUnits)){
	$unit = $row['Unit'];
	$active = $row['Active'];
	//return unit number
	echo $unit;
}



//add to db for setting request if not active
if ($active==0){
	mysqli_query($con, "INSERT INTO Requests(Unit) Values('$unit')");
}

//if there was a user 
if ($resultUnits->num_rows>0){
	//mark as logged in
	mysqli_query($con, "UPDATE Users SET Active='1' WHERE UN='$un' AND PW='$pw'");
}


?>
