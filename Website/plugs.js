// set image list
var imagesPlugs = {};
imagesPlugs[true]="images\\plugs\\on.gif";
imagesPlugs[false]="images\\plugs\\off.gif";

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
function plugs(device, name, state, value1, value2){
	//set up parameters for this object
	this.device = device;	
	this.name = name;
	this.state = state>0;	
	this.value1 = value1;
	this.value2 = value2;
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
* Changes the state of the plug
*
*
* params:
*	obj - object modified
********************************/
function changePoweredPlugs(obj){
	//store old values
	oldState = obj.state;
	oldValue1 = obj.value1;
	oldValue2 = obj.value2;
	
	//change the state stored
	obj.state = !obj.state;
	
	//change the image displayed
	changeServerPlugs(obj);
}

/********************************
* checkSucessPlugs
* -------
* Changes success of db action
*
*
* params:
*	obj - object modified
*	response - response from server
********************************/
function checkSucessPlugs(obj, response){
	if (response.responseText){
		changeImagePlugs(obj);
	}else if (response.readyState === 4){
		obj.state = oldState;
		obj.value1 = oldValue1;
		obj.value2 = oldValue2;
		alert("Error Communicating with server")
	}
}

/********************************
* changeServerPlugs
* -------
* Changes the info on db
*
*
* params:
*	obj - object modified
********************************/
function changeServerPlugs(obj){
	var url;		//url for http request
	var xmlhttp;	//for ajax request

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	
	//on finish
	xmlhttp.onreadystatechange=function(){
	  checkSucessPlugs(obj, xmlhttp);
	}
  
	//put state in format for server
	var state=0;
	if (obj.state){
		state = 1;
	}

	//send request
	var components = ['?','device=', obj.device, '&','state=',state,'&','value1=',obj.value1,'&','value2=',obj.value2];
	var urlGet = components.join("");
	url = changeURL.concat(urlGet);

	//create and send request
	xmlhttp.open("GET",url,true);
	xmlhttp.send(null);

}
