<?php
#Sets up a new user and gives them an id
#
#parameters:
#       un -  nnew username
#       pw - new password
#returns: 
#	id of the new unit

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
$un = $_POST['un'];
$pw = $_POST['pw'];

//Open connection with db
$con=mysqli_connect($host,$unDB,$pwDB, $DB);
if (mysqli_connect_errno()) {
    die('Connect Error: ' . mysqli_connect_errno());
}

//Update the db
$result = mysqli_query($con, "INSERT INTO Users(UN, PW, Active) Values('$un', '$pw','0')");

//return unit num
echo mysqli_insert_id($con)

?>
