<?php
#An update to a device is requested
#
#parameters:
#       unit - unit num
#       device - device num
#       type - device type
#       state - state
#       value1 - value1
#       value2 - value2
#returns: 
#	1 if update successful, else 0

header('Access-Control-Allow-Origin: *');  

#credentials file
$credentialsDBFile = "../credentialsDB";
$credentialsDB = explode("\n", file_get_contents($credentialsDBFile));

//DB parameters
$host = "localhost";
$unDB = $credentialsDB[0];
$pwDB = $credentialsDB[1];
$DB = "Smart_Home";

//Get info to change
$unit = $_POST['unit'];
$device = $_POST['device'];
$type = $_POST['type'];
$state = $_POST['state'];
$value1 = $_POST['value1'];
$value2 = $_POST['value2'];

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB, $DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}

//Update the db
$result = mysqli_query($con, "INSERT INTO Updates(Unit,Device, State, Type, Value1, Value2) Values('$unit', '$device','$state','$type','$value1','$value2')");

//check if database updated
for ($i=1; $i<=200; $i++){
    usleep(50000);

    $result = mysqli_query($con, "SELECT * FROM Devices WHERE  Unit='$unit' AND Device='$device'  AND State='$state' AND Type='$type' AND Value1='$value1' AND Value2='$value2'");
    
    //if there is a match
    if ($result->num_rows){
		//mark updated and return
		echo '1';
		return;
    }
}

//not updated
echo '0';
?>
