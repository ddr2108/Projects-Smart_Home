var namePlugsController = "Plugs";	//name object

////////////////////////////////////////////////////////
/********************************
* plugsController
* -------
* set up an object to represent
* a plug
*
*
* params:
*	id - unique ID for light
*	name - name of light
*	state - state of light
*	value1 - wildcard
*	value2 - wildcard
********************************/
function plugsController(device, name, state, value1, value2){
	//set up parameters each light in an array
	var i = 0;
	this.plugs = new Array();
	for (i = 0; i<device.length; i++){
		this.plugs[i] = new plugs(device[i], name[i], state[i], value1[i], value2[i]);
	}
	//Set up image parameter for controller
	this.image = new Image();
}

/********************************
* setUpImagePlugsController
* -------
* Sets up image on screen
*
*
* params:
*	obj - object modified
********************************/
function setUpImagePlugsController(obj){

	//create a div to hold image
	var div = document.createElement("div");
	div.class = "controller";
	div.id = PLUG;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imagesPlugs[true];
	obj.image.onclick = function(){setUpPlugs(obj);};
	obj.image.id = "image";
	document.getElementById(PLUG).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = namePlugsController;
	p.id = "title";
	document.getElementById(PLUG).appendChild(p);
}

/********************************
* setUpPlugs
* -------
* Set up to display the plugs
*
*
* params:
*	obj - object modified
********************************/
function setUpPlugs(obj){
	//clear all of the screen
	document.body.innerHTML = "";
	
	//Set up the actual plugs
	var i = 0;
	for(i =0; i<obj.plugs.length; i++){
		setUpImagePlugs(obj.plugs[i]);
	}
	
	//set up back button
	setUpImageBack(back);

}


