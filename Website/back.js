//back button
var back = new Image();
var imageBack = "images\\navigation\\back.png";

/********************************
* back
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
function back(id, name){
	//set up parameters for this object
	this.id = id;	
	this.name = name;
	this.image = new Image();
}

/********************************
* setUpImageBack
* -------
* Sets up image on screen for going back
*
*
* params:
*	obj - object modified
********************************/
function setUpImageBack(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imagesLights[obj.powered];
	obj.image.id = "image";
	obj.image.onclick = function(){changePoweredLights(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	p.id = "title";
	document.getElementById(obj.id).appendChild(p);
}