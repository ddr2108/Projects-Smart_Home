var imagesTemps = "images\\sensors\\temps\\thermometer.jpg";;

/********************************
* plugs
* -------
* set up an object to represent
* a plug
*
*
* params:
*	device - unique ID for plug
*	name - name of plug
*	state - state of plug
*	value1 - wildcard
*	value2 - wildcard
********************************/
function temps(device, name, state, value1, value2){
	//set up parameters for this object
	this.device = device;	
	this.name = name;
	this.state = state;	
	this.value1 = value1;
	this.value2 = value2;
	this.pending = 0;
}

/********************************
* setUpTempsInfo
* -------
* Sets up image on screen
*
*
* params:
*	obj - object modified
********************************/
function setUpTempsInfo(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.device;
	document.body.appendChild(div);

	//add temp to image
	var p = document.createElement("p");
	p.innerHTML = obj.value1.concat('F');
	p.id = "info";
	document.getElementById(obj.device).appendChild(p);
		
	//add humidity to image
	var p = document.createElement("p");
	p.innerHTML = obj.value2.concat('% humidity');
	p.id = "info";
	document.getElementById(obj.device).appendChild(p);

	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	p.id = "title";
	document.getElementById(obj.device).appendChild(p);
}
