// set image list
var imagesPlugs = {};
imagesPlugs[true]="images\\plugs\\on.gif";
imagesPlugs[false]="images\\plugs\\off.gif";

/********************************
* plugs
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
function plugs(device, name, state){
	//set up parameters for this object
	this.device = device;	
	this.name = name;
	this.state = state>0;	
	this.image = new Image();
	
	//preload images for this object
	preloadPlugs(this);
}

/********************************
* preloadPlugs
* -------
* preloads images that tell state
*
*
* params:
*	obj - object modified
********************************/
function preloadPlugs(obj){
	// start preloading
	obj.image.src=imagesPlugs[true];
	obj.image.src=imagesPlugs[false];
}

/********************************
* setUpImagePlugs
* -------
* Sets up image on screen
*
*
* params:
*	obj - object modified
********************************/
function setUpImagePlugs(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.device;
	document.body.appendChild(div);

	//add image for this plug
	obj.image.src = imagesPlugs[obj.state];
	obj.image.id = "image";
	obj.image.onclick = function(){changePoweredPlugs(obj);};
	document.getElementById(obj.device).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	p.id = "title";
	document.getElementById(obj.device).appendChild(p);
}

/********************************
* changeImagePlugs
* -------
* Change the image displayed
*
*
* params:
*	obj - object modified
********************************/
function changeImagePlugs(obj){
	obj.image.src = imagesPlugs[obj.state];
}

/********************************
* changePoweredPlugs
* -------
* Changes the state of the light
*
*
* params:
*	obj - object modified
********************************/
function changePoweredPlugs(obj){
	//change the state stored
	obj.state = !obj.state;
	
	//change the image displayed
	changeImagePlugs(obj);
}