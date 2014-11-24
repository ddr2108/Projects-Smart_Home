// set image list
var images = {};
images[true]="images\\bulb\\on.gif";
images[false]="images\\bulb\\off.gif";

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
********************************/
function lights(id, name, powered){
	//set up parameters for this object
	this.id = id;	
	this.name = name;
	this.powered = powered;	
	this.image = new Image();
	
	//preload images for this object
	preload();
	
	//Set up the button
	setUpImage(this);
}

/********************************
* preload
* -------
* preloads images that tell state
*
*
* params:
*	none
********************************/
function preload(){
	// create image object
	imageObj = new Image();

	// start preloading
	imageObj.src=images[true];
	imageObj.src=images[false];
}

/********************************
* setUpImage
* -------
* Sets up image on screen
*
*
* params:
*	none
********************************/
function setUpImage(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = images[obj.powered];
	obj.image.name = 'asd';
	obj.image.onclick = function(){changePowered(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	document.getElementById(obj.id).appendChild(p);
}

/********************************
* changeImage
* -------
* Change the image displayed
*
*
* params:
*	none
********************************/
function changeImage(obj){
	obj.image.src = images[obj.powered];
}

/********************************
* changePowered
* -------
* Changes the state of the light
*
*
* params:
*	none
********************************/
function changePowered(obj){
	//change the state stored
	obj.powered = !obj.powered;
	
	//change the image displayed
	changeImage(obj);
}