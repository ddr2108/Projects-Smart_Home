var nameTempsController = "Temps";	//name object

////////////////////////////////////////////////////////
/********************************
* tempsController
* -------
* set up an object to represent
* a temp
*
*
* params:
*	id - unique ID for light
*	name - name of light
*	state - state of light
*	value1 - wildcard
*	value2 - wildcard
********************************/
function tempsController(device, name, state, value1, value2){
	//set up parameters each light in an array
	var i = 0;
	this.temps = new Array();
	for (i = 0; i<device.length; i++){
		this.temps[i] = new temps(device[i], name[i], state[i], value1[i], value2[i]);
	}
	//Set up image parameter for controller
	this.image = new Image();
}

/********************************
* setUpImageTempsController
* -------
* Sets up image on screen
*
*
* params:
*	obj - object modified
********************************/
function setUpImageTempsController(obj){

	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imagesTemps;
	obj.image.onclick = function(){setUpTemps(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = nameTempsController;
	document.getElementById(obj.id).appendChild(p);
}

/********************************
* setUpTemps
* -------
* Set up to display the temps
*
*
* params:
*	obj - object modified
********************************/
function setUpTemps(obj){
	//clear all of the screen
	document.body.innerHTML = "";
	
	//Set up the actual temps
	var i = 0;
	for(i =0; i<obj.temps.length; i++){
		setUpTempsInfo(obj.temps[i]);
	}
	
	//set up back button
	setUpImageBack(back);

}


