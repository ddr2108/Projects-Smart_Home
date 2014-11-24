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
*	id - unique ID for light
*	name - name of light
*	powered - state of light
********************************/
function plugs(id, name, powered){
	//set up parameters for this object
	this.id = id;	
	this.name = name;
	this.powered = powered;	
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
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this plug
	obj.image.src = imagesPlugs[obj.powered];
	obj.image.onclick = function(){changePoweredPlugs(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	document.getElementById(obj.id).appendChild(p);
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
	obj.image.src = imagesPlugs[obj.powered];
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
	obj.powered = !obj.powered;
	
	//change the image displayed
	changeImagePlugs(obj);
}