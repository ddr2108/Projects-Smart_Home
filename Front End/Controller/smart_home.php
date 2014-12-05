<?php

//Device types
$ALL = -1;
$LIGHT = 1;
$PLUG = 2;
$TEMP = 3;
$MOTION = 4;

//DB parameters
$host = "localhost";
$unDB = "";
$pwDB = "";
$DB = "Smart_Home";

//DB connection
$con = '';

////////////////////////////////////////////////////////////
//initialize DB
dbInit();

//Form submit
processDevice();

//initialize form
formInit();
//////////////////////////////////////////////////////////////

function initialSetup(){
	gloabl $con;

	//check if unit number assigned
	
	//if not assigned create login form
	return 0;
	
	return 1;
}


function processInitialSetup(){
	//if setup flag

	//send request to server

	//check if valid

	//insert to database

	//report and tell to refresh
}

/*****************************
*dbInit
*performs database initialization
*
*parameters: none
*returns: none
*****************************/
function dbInit(){
	global $host, $unDB, $pwDB, $DB;
	global $con;

	//Credentials
	$credentialsDBFile = "/home/pi/SmartHome/credentialsDB";
	$credentialsDB = explode("\n", file_get_contents($credentialsDBFile));

	//DB parameters
	$unDB = $credentialsDB[0];
	$pwDB = $credentialsDB[1];
	
	//Open connection with db
	$con=mysqli_connect($host,$unDB,$pwDB,$DB);
	if (mysqli_connect_errno()) {
    		die('Connect Error: ' . mysqli_connect_errno());
	}
}

/*****************************
*formInit
*creates the form by getting
*data about what to create from
*db
*
*parameters: none
*returns: none
*****************************/
function formInit(){
	global $con;	

	$resultInfo = mysqli_query($con,"SELECT * FROM Devices");
	//Go through all the devices info
	while($row = mysqli_fetch_array($resultInfo)) {
	
		//pull out info
		$device = $row['Device'];
		$name = $row['Name'];
		$state = $row['State'];
		$type = $row['Type'];
		$value1 = $row['Value1'];
		$value2 = $row['Value2'];
	
		//Put it on screen
		postDevice($device, $name, $state, $type, $value1, $value2);
	}
}

/*****************************
*postDevice
*determines fx to call to create form
*
*parameters: 
*	$device - device id
*	$name - name of object
*	$state - state of object
*	$type - type of object
*	$value1 - wildcard1
*	$value2 - wildcard2
*returns: none
*****************************/
function postDevice($device, $name, $state, $type, $value1, $value2){
	global $ALL, $LIGHT, $PLUG, $TEMP, $MOTION;
	//call the right function to process this type of object
	if (intval($type)==intval($LIGHT)){
		postLight($device, $name, $state,  $value1, $value2);
        }elseif (intval($type)==$PLUG){
		postPlug($device, $name, $state,  $value1, $value2);
        }elseif ($type==$TEMP){
		postTemp($device, $name, $state,  $value1, $value2);
        }
}

/*****************************
*postLight
*creates form for light
*
*parameters:
*       $device - device id
*       $name - name of object
*       $state - state of object
*       $value1 - wildcard1
*       $value2 - wildcard2
*returns: none
*****************************/
function postLight($device, $name, $state,  $value1, $value2){
	//Create a form that allows for modifying light
        echo "<body>";
        echo "<form action='?light' method='post'>";
        echo "<p>";
        echo " Light:<br/>";
        echo "<input name='name' type='text' value='$name'/><br/><br/>";
        if ($state==0){
                echo "<select name='state'><option value='1'>On</option><option value='0' selected='selected'>Off</option></select><br/><br/>";
        }else{
                echo "<select name='state'><option value='1' selected='selected'>On</option><option value='0'>Off</option></select><br/><br/>";
        }
	echo "<input type='submit' value='Submit'/></p>";
        echo "<input type='hidden' name='device' value='$device'>";
        echo "<input type='hidden' name='value1' value='$value2'>";
        echo "<input type='hidden' name='value2' value='$value1'>";
        echo "<p>";
        echo "</form>";
        echo "</body>";
}

/*****************************
*postPlug
*creates form for plug
*
*parameters:
*       $device - device id
*       $name - name of object
*       $state - state of object
*       $value1 - wildcard1
*       $value2 - wildcard2
*returns: none
*****************************/
function postPlug($device, $name, $state,  $value1, $value2){
	//Create a form that allows for modifying plug
	echo "<body>";
	echo "<form action='?plug' method='post'>";
        echo "<p>";
        echo "Plug:<br/>";
	echo "<input name='name' type='text' value='$name'/><br/><br/>";
	if ($state==0){
		echo "<select name='state'><option value='1'>On</option><option value='0' selected='selected'>Off</option></select><br/><br/>";
	}else{
                echo "<select name='state'><option value='1' selected='selected'>On</option><option value='0'>Off</option></select><br/><br/>";
	}
	echo "<input type='submit' value='Submit'/></p>";
        echo "<input type='hidden' name='device' value='$device'>";
        echo "<input type='hidden' name='value1' value='$value2'>";
        echo "<input type='hidden' name='value2' value='$value1'>";
	echo "<p>";
	echo "</form>";
	echo "</body>";
}

/*****************************
*postTemp
*creates form for temp
*
*parameters:
*       $device - device id
*       $name - name of object
*       $state - state of object
*       $value1 - wildcard1
*       $value2 - wildcard2
*returns: none
*****************************/
function postTemp($device, $name, $state,  $value1, $value2){
	//Create a form that allows for data of thermometer
        echo "<body>";
        echo "<form action='?temp' method='post'>";
        echo "<p>";
        echo "Temperature:<br/>";
        echo "<input name='name' type='text' value='$name'/><br/><br/>";
        echo "Temperature:$value1 F     Humidity:$value2% <br/><br/>";
        echo "<input type='submit' value='Submit'/></p>";
	echo "<input type='hidden' name='device' value='$device'>";
        echo "<input type='hidden' name='state' value='$state'>";
	echo "<input type='hidden' name='value1' value='$value2'>";
        echo "<input type='hidden' name='value2' value='$value1'>";
	echo "<p>";
        echo "</form>";
        echo "</body>";
}

/*****************************
*processDevice
*determines which fx to call
*to process form
*
*parameters: none
*returns: none
*****************************/
function processDevice(){
	//see what was pressesd and process accordingly
	if(isset($_GET['temp'])){
		processTemp();
	}elseif (isset($_GET['plug'])){
		processPlug();
	}elseif (isset($_GET['light'])){
		processLight();
	}
}

/*****************************
*processLight
*process light info
*
*parameters: none
*returns: none
*****************************/
function processLight(){
        global $LIGHT;
        global $con;

        //Update Name
        //pull out info
        $device = $_POST['device'];
        $name = $_POST['name'];
        //complete query
        $resultInfo = mysqli_query($con,"UPDATE Devices SET Name='$name' WHERE Device='$device' AND Type='$LIGHT'");

        //Set to update
        $state = $_POST['state'];
        $value1 = $_POST['value1'];
        $value2 = $_POST['value2'];
        mysqli_query($con, "INSERT INTO Updates(Device, State, Type, Value1, Value2) Values('$device','$state','$PLUG','$value1','$value2')");
}

/*****************************
*processPlug
*process plug info
*
*parameters: none
*returns: none
*****************************/
function processPlug(){
	global $PLUG;
        global $con;

        //Update Name
        //pull out info
        $device = $_POST['device'];
        $name = $_POST['name'];
        //complete query
        $resultInfo = mysqli_query($con,"UPDATE Devices SET Name='$name' WHERE Device='$device' AND Type='$PLUG'");

	//Set to update 
	$state = $_POST['state'];
	$value1 = $_POST['value1'];
	$value2 = $_POST['value2'];
	mysqli_query($con, "INSERT INTO Updates(Device, State, Type, Value1, Value2) Values('$device','$state','$PLUG','$value1','$value2')");
}

/*****************************
*processTemp
*process temp info
*
*parameters: none
*returns: none
*****************************/
function processTemp(){
	global $TEMP;
	global $con;
	
	//Update Name
	//pull out info
	$device = $_POST['device'];
	$name = $_POST['name'];
	//complete query 
	$resultInfo = mysqli_query($con,"UPDATE Devices SET Name='$name' WHERE Device='$device' AND Type='$TEMP'");
}

?>
