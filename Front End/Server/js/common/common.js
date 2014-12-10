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
var loginURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/user/login.php";
var logoutURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/user/logout.php";
var pendingUpdatesURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/update/pendingUpdates.php";
var pendingRequestsURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/request/pendingRequests.php";
var getDevicesURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/device/getDevices.php";
var getActiveURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/user/getActive.php";
var clearRequestURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/request/clearRequest.php";
var setDeviceURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/update/setDevice.php";
var updateDeviceURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/update/updateDevice.php";
var aliveURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/ping/alive.php";
var getSingleURL = "http://deepdattaroy.com/other/projects/Services/SmartHome/device/getSingle.php";
//unit number
var unitNum = 0;