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
*	powered - state of light
********************************/
function plugsController(id, name, powered, number){
	//set up parameters each light in an array
	var i = 0;
	this.plugs = new Array();
	for (i = 0; i<id.length; i++){
		this.plugs[i] = new plugs(id[i], name[i], powered[i]);
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
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imagesPlugs[true];
	obj.image.onclick = function(){setUpPlugs(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = namePlugsController;
	document.getElementById(obj.id).appendChild(p);
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


