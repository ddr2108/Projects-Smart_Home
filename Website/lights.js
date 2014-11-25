// set image list
var imagesLights = {};
imagesLights[true]="images\\bulbs\\on.gif";
imagesLights[false]="images\\bulbs\\off.gif";

////////////////////////////////////////////////////////
/********************************
* lights
* -------
* set up an object to represent
* a light
*
*
* params:
*	device - unique ID for light
*	name - name of light
*	state - state of light
********************************/
function lights(device, name, state){
	//set up parameters for this object
	this.device = device;	
	this.name = name;
	this.state = state>0;	
	this.image = new Image();
	
	//preload images for this object
	preloadLights(this);	
}

/********************************
* preloadLights
* -------
* preloads images that tell state
*
*
* params:
*	obj - object modified
********************************/
function preloadLights(obj){
	// start preloading
	obj.image.src=imagesLights[true];
	obj.image.src=imagesLights[false];
}

/********************************
* setUpImageLights
* -------
* Sets up image on screen
*
*
* params:
*	obj - object modified
********************************/
function setUpImageLights(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.device;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imagesLights[obj.state];
	obj.image.id = "image";
	obj.image.onclick = function(){changePoweredLights(obj);};
	document.getElementById(obj.device).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	p.id = "title";
	document.getElementById(obj.device).appendChild(p);
}

/********************************
* changeImageLights
* -------
* Change the image displayed
*
*
* params:
*	obj - object modified
********************************/
function changeImageLights(obj){
	obj.image.src = imagesLights[obj.state];
}

/********************************
* changePoweredLights
* -------
* Changes the state of the light
*
*
* params:
*	obj - object modified
********************************/
function changePoweredLights(obj){
	//change the state stored
	obj.state = !obj.state;
	
	//change the image displayed
	changeImageLights(obj);
}