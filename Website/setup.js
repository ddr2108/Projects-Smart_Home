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
*	none
********************************/
function setup(){
	//set up array with all the lights	
	var id = [1, 2, 3];
	var name = ['kitchen', 'family room', 'laundary room'];
	var powered = [false, false, true];
	var light1 = new lightsController(id, name, powered, 3);

	//set up array with all the plugs
	var id = [4, 5, 6];
	var name = ['kitchen', 'family room', 'laundary room'];
	var powered = [false, true, true];
	var plug1 = new plugsController(id, name, powered, 3);
	
	//Save controllers
	controller['light'] = light1;
	controller['plug'] = plug1;
	controllerAvail['light'] = true;
	controllerAvail['plug'] = true;
	
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
	if (controllerAvail['light']){
		setUpImageLightsController(controller['light']);
	}
	if (controllerAvail['plug']){
		setUpImagePlugsController(controller['plug']);
	}
}