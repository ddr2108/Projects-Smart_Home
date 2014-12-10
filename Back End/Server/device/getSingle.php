<?php
#Pulls out information about devices associated
#with unit number
#
#parameters:
#       unit - unit num
#returns:
#       a list of units, their device #, name, state,
#	value1, and value2 sepearted by :

header('Access-Control-Allow-Origin: *');  

$credentialsDBFile = "../credentialsDB";
$credentialsDB = explode("\n", file_get_contents($credentialsDBFile));

//DB parameters
$host = "localhost";
$unDB = $credentialsDB[0];
$pwDB = $credentialsDB[1];
$DB = "Smart_Home";

//get data from request
$unit = $_POST['unit'];
$type = $_POST['type'];
$device = $_POST['device'];

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB,$DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}
		
//check if request has been completed		
//check if database updated
$result = mysqli_query($con, "SELECT * FROM Devices WHERE  Unit='$unit' AND DEVICE='$device' AND TYPE='$type'");
		
//Go through all the devices info
while($row = mysqli_fetch_array($result)) {
	
	//pull out info
	$state = $row['State'];
	$value1 = $row['Value1'];
	$value2 = $row['Value2'];

	//print out the info
	echo $state . ":" . $value1 . ":" . $value2;
}

?>
