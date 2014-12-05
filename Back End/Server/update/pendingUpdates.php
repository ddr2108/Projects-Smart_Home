<?php
#Allows for checking if there is a update pending
#for a particular unit
#
#parameters:
#       unit - unit num
#returns:
#       list of updates with the device, state, type,
#	value1, and value2 sepeataed by :


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

//go through all devices with this unit
$resultInfo = mysqli_query($con,"SELECT * FROM Updates WHERE UNIT='$unit'");
//Go through all the devices info
while($row = mysqli_fetch_array($resultInfo)) {
	
	//pull out info
	$device = $row['Device'];
	$state = $row['State'];
	$type = $row['Type'];
	$value1 = $row['Value1'];
	$value2 = $row['Value2'];

	//print out the info
	echo $device . ":" . $state . ":" . $type . ":" . $value1 . ":" . $value2 . ":";
}

//delete the sent items
mysqli_query($con,"DELETE FROM Updates WHERE Unit='$unit'");

?>
