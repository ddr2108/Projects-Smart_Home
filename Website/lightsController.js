/********************************
* lights
* -------
* set up an object to represent
* a light
*
*
* params:
*	id - unique ID for light
*	name - name of light
*	powered - state of light
*	number - number of elements
********************************/
function lights(id, name, powered, number){
	//set up parameters for this object
	this.id = id;	
	this.name = name;
	this.number = number;
	this.image = new Image();
	
	//set up images
	setUpImageLightsController(this);
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
	obj.image.src = "images\\bulbs\\on.gif";
	obj.image.onclick = function(){changePoweredLights(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
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
}


