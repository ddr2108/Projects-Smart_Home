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

	//check for temp
	changeServerTemps(obj);
	
}

/********************************
* checkSucessTemps
* -------
* Changes success of db action
*
*
* params:
*	obj - object modified
*	response - response from server
********************************/
function checkSucessTemps(obj, response){
	if (response.responseText && response.responseText!=0){
		//check for new data
		var deviceParameters = response.responseText.split(":");
		obj.state = deviceParameters[0];
		obj.value1 = deviceParameters[1];
		obj.value2 = deviceParameters[2];		
	}
}

/********************************
* changeServerTemps
* -------
* Changes the info on db
*
*
* params:
*	obj - object modified
********************************/
function changeServerTemps(obj){
	var url;		//url for http request
	var xmlhttp;	//for ajax request
	
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	
	//on finish
	xmlhttp.onreadystatechange=function(){
	  checkSucessTemps(obj, xmlhttp);
	}
  
	//put state in format for server
	var state=0;
	if (obj.state){
		state = 1;
	}

	//send request
	var components = ['device=', obj.device,'&','type=',TEMP, '&','unit=', unitNum];
	var urlPost = components.join("");

	//create and send request
	xmlhttp.open("POST",getSingleURL,true);
	//Send the proper header information along with the request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//send request
	xmlhttp.send(urlPost);
}
