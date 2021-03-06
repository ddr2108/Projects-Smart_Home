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
  
	var components = ['un=', form.username.value,'&','pw=',form.password.value];
	var urlPost = components.join("");
		
	//create and send request
	xmlhttp.open("POST",loginURL,true);
	//Send the proper header information along with the request
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//send request
	xmlhttp.send(urlPost);
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
	} else{
		//login failed warning
		if (!document.getElementById("warningDiv")){
			//create a div to hold warning
			var div = document.createElement("div");
			div.id = "warningDiv";
			document.body.appendChild(div);

			//add title to image
			var p = document.createElement("p");
			p.innerHTML = "Login Failed";
			p.id = "warning";
			document.getElementById("warningDiv").appendChild(p);
		}

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
	
	//save unit number
	unitNum=unit;
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