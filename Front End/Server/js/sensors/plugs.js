// set image list
var imagesPlugs = {};
imagesPlugs[true]="images\\sensors\\plugs\\on.gif";
imagesPlugs[false]="images\\sensors\\plugs\\off.gif";

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
	this.pending = 0;
	
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
	div.className = "sensor";
	div.id = obj.device;
	document.body.appendChild(div);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	p.id = "title";
	document.getElementById(obj.device).appendChild(p);

	//add image for this plug
	obj.image.src = imagesPlugs[obj.state];
	obj.image.id = "image";
	obj.image.onclick = function(){changePoweredPlugs(obj);};
	document.getElementById(obj.device).appendChild(obj.image);
	
	var hr = document.createElement("hr");
	document.getElementById(obj.device).appendChild(hr);

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
	
	//only do if not another request pending
	if (obj.pending==1){
		return;
	}
	obj.pending = 1;

	//store old values
	obj.oldState = obj.state;
	obj.oldValue1 = obj.value1;
	obj.oldValue2 = obj.value2;
	
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
	if (response.responseText && response.responseText!=0){
		obj.pending = 0;
		changeImagePlugs(obj);
	}else if (response.readyState === 4){
		obj.pending = 0;
		obj.state = obj.oldState;
		obj.value1 = obj.oldValue1;
		obj.value2 = obj.oldValue2;
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
	var components = ['device=', obj.device, '&','state=',state,'&','value1=',obj.value1,'&','value2=',obj.value2, '&','type=',PLUG, '&','unit=', unitNum];
	var urlPost = components.join("");

	//create and send request
	xmlhttp.open("POST",updateDeviceURL,true);
	//Send the proper header information along with the request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//send request
	xmlhttp.send(urlPost);
}
