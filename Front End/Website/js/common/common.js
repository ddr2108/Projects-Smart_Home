//Device types
var ALL = -1;
var LIGHT = 1;
var PLUG = 2;
var TEMP = 3;
var MOTION = 4;

//variables for storing old states
var oldState;
var oldValue1;
var oldValue2;

//URLs
var loginURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/login.php";
var deviceURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/getDevices.php";
var changeURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/updateDevice.php";

//unit number
var unitNum = 0;