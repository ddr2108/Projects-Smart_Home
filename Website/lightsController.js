var nameLightsController = "Lights";	//name object

////////////////////////////////////////////////////////
/********************************
* lightsController
* -------
* set up an object to represent
* a light
*
*
* params:
*	id - unique ID for light
*	name - name of light
*	powered - state of light
********************************/
function lightsController(id, name, powered){
	//set up parameters each light in an array
	var i = 0;
	this.lights = new Array();
	for (i = 0; i<id.length; i++){
		this.lights[i] = new lights(id[i], name[i], powered[i]);
	}
	//Set up image parameter for controller
	this.image = new Image();
}

/********************************
* setUpImageLightsController
* -------
* Sets up image on screen
*
*
* params:
*	obj - object modified
********************************/
function setUpImageLightsController(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imagesLights[true];
	obj.image.onclick = function(){setUpLights(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = nameLightsController;
	document.getElementById(obj.id).appendChild(p);
}

/********************************
* setUpLights
* -------
* Set up to display the lights
*
*
* params:
*	obj - object modified
********************************/
function setUpLights(obj){
	//clear all of the screen
	document.body.innerHTML = "";
	
	//Set up the actual lights
	var i = 0;
	for(i =0; i<obj.lights.length; i++){
		setUpImageLights(obj.lights[i]);
	}
	
	//set up back button
	setUpImageBack(back);
}


