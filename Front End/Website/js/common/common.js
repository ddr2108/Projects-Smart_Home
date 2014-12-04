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
var logoutURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/logout.php";
var pendingUpdatesURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/pendingUpdates.php";
var pendingRequestsURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/pendingRequests.php";
var getDevicesURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/getDevices.php";
var getActiveURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/getActive.php";
var clearRequestURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/clearRequest.php";
var setDeviceURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/setDevice.php";
var updateDeviceURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/updateDevice.php";

//unit number
var unitNum = 0;