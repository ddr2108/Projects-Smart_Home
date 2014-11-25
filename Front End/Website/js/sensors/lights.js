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
*	value1 - wildcard
*	value2 - wildcard
********************************/
function lights(device, name, state, value1, value2){
	//set up parameters for this object
	this.device = device;	
	this.name = name;
	this.state = state>0;		
	this.value1 = value1;
	this.value2 = value2;
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
	//store old values
	oldState = obj.state;
	oldValue1 = obj.value1;
	oldValue2 = obj.value2;
	
	//change the state stored
	obj.state = !obj.state;
	
	//change the image displayed
	changeServerLights(obj);
}

/********************************
* checkSucessLights
* -------
* Changes success of db action
*
*
* params:
*	obj - object modified
*	response - response from server
********************************/
function checkSucessLights(obj, response){
	if (response.responseText){
		changeImageLights(obj);
	}else if (response.readyState === 4){
		obj.state = oldState;
		obj.value1 = oldValue1;
		obj.value2 = oldValue2;
		alert("Error Communicating with server")
	}
}

/********************************
* changeServerLights
* -------
* Changes the info on db
*
*
* params:
*	obj - object modified
********************************/
function changeServerLights(obj){
	var url;		//url for http request
	var xmlhttp;	//for ajax request

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	
	//on finish
	xmlhttp.onreadystatechange=function(){
	  checkSucessLights(obj, xmlhttp);
	}
  
	//put state in format for server
	var state=0;
	if (obj.state){
		state = 1;
	}

	//send request
	var components = ['device=', obj.device, '&','state=',state,'&','value1=',obj.value1,'&','value2=',obj.value2];
	var urlPost = components.join("");

	//create and send request
	xmlhttp.open("POST",changeURL,true);
	//Send the proper header information along with the request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//send request
	xmlhttp.send(urlPost);

}