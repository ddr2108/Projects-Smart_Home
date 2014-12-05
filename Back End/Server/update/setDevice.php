<?php
#Sets up an update for a device from controller
#
#parameters:
#       unit - unit num
#	device - device num
#	type - device type
#	state - state
#	value1 - value1
#	value2 - value2
#	name - name of dev
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

//Get info to change
$unit = $_POST['unit'];
$device = $_POST['device'];
$type = $_POST['type'];
$state = $_POST['state'];
$value1 = $_POST['value1'];
$value2 = $_POST['value2'];
$name = $_POST['name'];

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB, $DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}

echo isset($_POST['name']);
//if name is set, assume post new
if (isset($_POST['name'])){
    //add to db
    mysqli_query($con, "INSERT INTO Devices(Name,Unit,Device, State, Type, Value1, Value2) Values('$name', '$unit', '$device','$state','$type','$value1','$value2')");
}else{
    //Update the db
    mysqli_query($con, "UPDATE Devices SET State='$state', Value1='$value1', Value2='$value2' WHERE Device='$device' AND Unit='$uni' AND Type='$type'");
}

?>
