var controller = new Array();
var controllerAvail = new Array();

////////////////////////////////////////////////

/********************************
* setup
* -------
* Sets up each controller
*
*
* params:
*	unit - unit id
********************************/
function setup(unit){
	var url;		//url for http request
	var xmlhttp;	//for ajax request

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	
	//on finish
	xmlhttp.onreadystatechange=function(){
	  processDevices(xmlhttp.responseText);
	}
  
	var components = ['unit=', unit];
	var urlPost = components.join("");
		
	//create and send request
	xmlhttp.open("POST",deviceURL,true);
	//Send the proper header information along with the request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//send request
	xmlhttp.send(urlPost);
}

/********************************
* processDevices
* -------
* Processes Devices
*
*
* params:
*	response - response text
********************************/
function processDevices(response){
	//parse the data
	var deviceParameters = response.split(":");
	
	//Arrays to hold data
	var deviceArray = new Array();
	var nameArray = new Array();
	var stateArray = new Array();
	var typeArray = new Array();
	var value1Array = new Array();
	var value2Array = new Array();
	
	//go through received data
	var i = 0;
	for (i=0; i<deviceParameters.length-1; i=i+6){
		deviceArray[i/6] = deviceParameters[i];
		nameArray[i/6] = deviceParameters[i+1];
		stateArray[i/6] = deviceParameters[i+2];
		typeArray[i/6] = deviceParameters[i+3];
		value1Array[i/6] = deviceParameters[i+4];
		value2Array[i/6] = deviceParameters[i+5];
	}
	//initialize controllers
	initializeControllers(deviceArray, nameArray, stateArray, typeArray, value1Array, value2Array);
}

/********************************
* initializeControllers
* -------
* Displays controller page
*
*
* params:
*	deviceArray - device id
*	nameArray - name
*	stateArray - state
*	typeArray - type of device
*	value1Array - wildcard value 1
*	value2Array - wildcard value 2
********************************/
function initializeControllers(deviceArray, nameArray, stateArray, typeArray, value1Array, value2Array){

	//arrays to hold which index is for which device
	var lightIndex = new Array();
	var plugIndex = new Array();


	//go through devices
	var i = 0;
	for (i = 0; i<typeArray.length; i++){
		if (typeArray[i]=='light'){
			lightIndex.push(i);
		}else if (typeArray[i]=='plug'){
			plugIndex.push(i);
		}
	}

	//arrays to hold parameters
	var device = new Array(); 
	var name = new Array();
	var state = new Array(); 
	var value1 = new Array(); 
	var value2 = new Array();
	
	//set up array with all the lights	
	for (i = 0; i<lightIndex.length; i++){
		device.push(deviceArray[lightIndex[i]]);
		name.push(nameArray[lightIndex[i]]);
		state.push(stateArray[lightIndex[i]]);
		value1.push(value1Array[lightIndex[i]]);
		value2.push(value2Array[lightIndex[i]]);
	}
	//if there is a light
	if (device.length>0){
		var lights = new lightsController(device, name, state, value1, value2);
		controller['lights'] = lights;
		controllerAvail['lights'] = true;
	}
	//Clear arrays
	device = []; 
	name = [];
	state = []; 
	value1 = []; 
	value2 = [];	

	//Set up array for plugs
	for (i = 0; i<plugIndex.length; i++){
		device.push(deviceArray[plugIndex[i]]);
		name.push(nameArray[plugIndex[i]]);
		state.push(stateArray[plugIndex[i]]);
		value1.push(value1Array[plugIndex[i]]);
		value2.push(value2Array[plugIndex[i]]);
	}
	//if there is a light
	if (device.length>0){
		var plugs = new plugsController(device, name, state, value1, value2);
		controller['plugs'] = plugs;
		controllerAvail['plugs'] = true;
	}
	//Clear arrays
	device = []; 
	name = [];
	state = []; 
	value1 = []; 
	value2 = [];	
	
	
	//Display controllers
	displayControllers();
}


/********************************
* displayControllers
* -------
* Displays controller page
*
*
* params:
*	none
********************************/
function displayControllers(){
	//clear screen
	document.body.innerHTML = "";
	
	//Check which controllers are avaialable and call
	if (controllerAvail['lights']){
		setUpImageLightsController(controller['lights']);
	}
	if (controllerAvail['plugs']){
		setUpImagePlugsController(controller['plugs']);
	}
	
	//set up logout
	setUpImageLogout(logout);
}