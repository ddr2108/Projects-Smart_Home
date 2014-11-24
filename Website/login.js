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
	//create form
	var form = document.createElement("form");
	form.setAttribute('method',"get");

	//create username field
	var unField = document.createElement("input"); //input element, text
	unField.setAttribute('type',"text");
	unField.setAttribute('name',"username");

	//create password field
	var pwField= document.createElement("input"); //input element, text
	pwField.setAttribute('type',"text");
	pwField.setAttribute('name',"password");

	//create submit button
	var submitButton = document.createElement("input"); //input element, Submit button
	submitButton.setAttribute('type',"button");
	submitButton.setAttribute('value',"Log In");
	submitButton.setAttribute('onclick',"checkLogin();");

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
*	none
********************************/
function checkLogin(){
		document.body.innerHTML = "";

	//begin setup for user
	beginSetup();
}

/********************************
* beginSetup
* -------
* Begin the setup for user
*
*
* params:
*	none
********************************/
function beginSetup(){

	//set up the page
	setup();
}