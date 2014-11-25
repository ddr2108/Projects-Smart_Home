/********************************
* main
* -------
* Beginning of prgoram
*
*
* params:
*	none
********************************/
function main(){
	//reset everything
	reset();

	//create form
	var form = document.createElement("form");
	form.setAttribute('method',"get");

	//create username field
	var unField = document.createElement("input"); //input element, text
	unField.setAttribute('type',"text");
	unField.setAttribute('name',"username");

	//create password field
	var pwField= document.createElement("input"); //input element, text
	pwField.setAttribute('type',"password");
	pwField.setAttribute('name',"password");

	//create submit button
	var submitButton = document.createElement("input"); //input element, Submit button
	submitButton.setAttribute('type',"button");
	submitButton.setAttribute('value',"Log In");
	submitButton.setAttribute('onclick',"checkLogin(form);");

	//add items to form
	form.appendChild(unField);
	form.appendChild(pwField);
	form.appendChild(submitButton);

	//add to page
	document.body.appendChild(form);
}

/********************************
* checkLogin
* -------
* Check the login info
*
*
* params:
*	form - the input form
********************************/
function checkLogin(form){

	var url;		//url for http request
	var xmlhttp;	//for ajax request

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	
	//on finish
	xmlhttp.onreadystatechange=function(){
	  login(xmlhttp.responseText);
	}
  
	var components = ['?','un=', form.username.value,'&','pw=',form.password.value];
	var urlGet = components.join("");
	url = loginURL.concat(urlGet);
		
	//create and send request
	xmlhttp.open("GET",url,true);
	xmlhttp.send(null);
}

/********************************
* login
* -------
* if login info correct, start login
*
*
* params:
*	response - response from server
********************************/
function login(response){
	//recv something, then login
	if (response!=""){
		//clear screen
		document.body.innerHTML = "";
	
		//begin setup for user
		beginSetup(response);
	}
}

/********************************
* beginSetup
* -------
* Begin the setup for user
*
*
* params:
*	unit-id
********************************/
function beginSetup(unit){
	//set up the page
	setup(unit);
}

/********************************
* reset
* -------
* resets screen and settings
*
*
* params:
*	none
********************************/
function reset(){
	//clear screen
	document.body.innerHTML = "";

	//restet variables
	controller = [];
	controllerAvail = [];

}