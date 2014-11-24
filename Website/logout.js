//back button
var imageLogout = "images\\navigation\\back.png";
/////////////////////////////////////////////////////

/********************************
* logout
* -------
* set up an object to represent
* logout
*
*
* params:
*	id - unique ID for light
*	name - name of light
*	powered - state of light
********************************/
function logout(id, name){
	//set up parameters for this object
	this.id = id;	
	this.name = name;
	this.image = new Image();
}

/********************************
* setUpImageLogout
* -------
* Sets up image on screen for going logout
*
*
* params:
*	obj - object modified
********************************/
function setUpImageLogout(obj){
	//create a div to hold image
	var div = document.createElement("div");
	div.id = obj.id;
	document.body.appendChild(div);

	//add image for this light
	obj.image.src = imageBack;
	obj.image.id = "image";
	obj.image.onclick = function(){goLogin(obj);};
	document.getElementById(obj.id).appendChild(obj.image);
	
	//add title to image
	var p = document.createElement("p");
	p.innerHTML = obj.name;
	p.id = "title";
	document.getElementById(obj.id).appendChild(p);
}

/********************************
* goLogin
* -------
* Go to login screen
*
*
* params:
*	obj - object modified
********************************/
function goLogin(obj){
	//display home controllers
	main();
}

var logout = new logout('logout', 'Log out');
