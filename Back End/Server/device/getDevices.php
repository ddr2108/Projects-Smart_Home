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

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB,$DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}
		
//check if request has been completed		
//check if database updated
for ($i=1; $i<=100; $i++){
    usleep(50000);

    $result = mysqli_query($con, "SELECT * FROM Requests WHERE  Unit='$unit'");
    
    //if request cleared
    if ($result->num_rows==0){
		//mark updated and return
		break;
    }
}		
		
//go through all devices with this unit
$resultInfo = mysqli_query($con,"SELECT * FROM Devices WHERE UNIT='$unit'");
//Go through all the devices info
while($row = mysqli_fetch_array($resultInfo)) {
	
	//pull out info
	$device = $row['Device'];
	$name = $row['Name'];
	$state = $row['State'];
	$type = $row['Type'];
	$value1 = $row['Value1'];
	$value2 = $row['Value2'];

	//print out the info
	echo $device . ":" . $name . ":" . $state . ":" . $type . ":" . $value1 . ":" . $value2 . ":";
}

?>
