import urllib2
import urllib
import MySQLdb
import time

#database stuff
HOST  = "localhost"
USER = ""
PW = ""
DB = "Smart_Home"

#server
setDeviceURL = 'http://deepdattaroy.com/other/projects/Services/SmartHome/update/setDevice.php'
clearRequestURL = 'http://deepdattaroy.com/other/projects/Services/SmartHome/request/clearRequest.php'
getActiveURL = 'http://deepdattaroy.com/other/projects/Services/SmartHome/user/getActive.php'
pendingRequestsURL = 'http://deepdattaroy.com/other/projects/Services/SmartHome/request/pendingRequests.php'

#database variables
curDB = ''
db = ''

#Device settings
unit = 0
active = 0
request = 0
prevTimestamp = 0;

#################################
#init
#does the intial setup
#
#parameters: none
#returns: none
################################
def init():
	global curDB
    	global db
	global unit
			
	#get db credentials
	getCredentials()

    	#open db connection 
    	db = MySQLdb.connect(host=HOST,
			user=USER,
			passwd=PW,
			db=DB) 
    	curDB = db.cursor()

	#get the unit number
	curDB.execute("SELECT * FROM Unit")
	unit = curDB.fetchone()[0];

	return;

#################################
#loop
#main loop of the program
#
#parameters: none
#returns: none
################################
def loop():
	#infintite loop of checking for udpates
	while True:
		#delay
		time.sleep(0.1)

		#check status
		checkActive()
		checkRequest()

		#process data
		process()

	return;

#################################
#getCredentials
#get credentials for db
#
#parameters: none
#returns: none
################################
def getCredentials():
	global USER
	global PW

	#open file and pull out credentials
	file = open('../credentialsDB','r')
	USER = file.readline()[:-1]
	PW = file.readline()[:-1]
	file.close()

#################################
#processAll
#post all states to server
#
#parameters: none
#returns: none
################################
def process():
	global prevTimestamp

	#data requested
	if request == 1:
		processAll()
		prevTimestamp = time.time()
	#user active
	elif active==1:
 		processUpdates()
		prevTimestamp = time.time() - 1

	return


#################################
#processAll
#post all states to server
#
#parameters: none
#returns: none
################################
def processAll():

	#create command
	command = "SELECT * FROM Devices WHERE Time>'0'"
	#get from db
        try:
        	curDB.execute(command)
        except:
        	db = MySQLdb.connect(host=HOST,
                     user=USER,
                     passwd=PW,
                     db=DB)
           	curDB = db.cursor()
      	        curDB.execute(command) 
   	db.commit()

	#go through results
	for i in range(curDB.rowcount):
		row = curDB.fetchone()
		sendNew(row[0], row[1], row[2], row[3], row[4], row[5])
	
	#delete request
	deleteRequest()

	return

#################################
#sendUpdates
#send updates to server
#
#parameters: none
#returns: none
################################
def sendUpdates(device, state, type, value1, value2):

	#url components
	urlPost = {'unit':unit, 'device':device, 'state':state, 'type':type, 'value1':value1, 'value2':value2}
		
	#create the encoded post data
	data = urllib.urlencode(urlPost)
	
	#submit the request
	request = urllib2.Request(setDeviceURL, data)
		
	#get the reponse
	try:
		urllib2.urlopen(request).read()
        except:
                return

	
	return

#################################
#sendNew
#send new data to server
#
#parameters: none
#returns: none
################################
def sendNew(device, name, state, type, value1, value2):
	#url components
	urlPost = {'unit':unit, 'device':device, 'name':name, 'state':state, 'type':type, 'value1':value1, 'value2':value2}
	#create the encoded post data
	data = urllib.urlencode(urlPost)
	
	#submit the request
	request = urllib2.Request(setDeviceURL, data)
		
	#get the reponse
	try:
		urllib2.urlopen(request).read()
        except:
                return

	return

#################################
#deleteRequest
#Delete Request at server
#
#parameters: none
#returns: none
################################
def deleteRequest():
	#url components
	urlPost = {'unit':unit}
	
	#create the encoded post data
	data = urllib.urlencode(urlPost)
	
	#submit the request
	request = urllib2.Request(clearRequestURL, data)
		
	#get the reponse
	try:
		response = urllib2.urlopen(request).read()
	except:
                return

	
	return


#################################
#processUpdates
#post any updates to server
#
#parameters: none
#returns: none
################################
def processUpdates():
	#create command
	command = "SELECT * FROM Devices WHERE Time>" + str(prevTimestamp)
	#get from db
	try:
                curDB.execute(command)
        except:
                db = MySQLdb.connect(host=HOST,
                     user=USER,
                     passwd=PW,
                     db=DB)
                curDB = db.cursor()
                curDB.execute(command)     
	db.commit()
	
	#go through results
	for i in range(curDB.rowcount):
		row = curDB.fetchone()
		sendUpdates(row[0], row[2], row[3], row[4], row[5])

	return


#################################
#checkActive
#check if unit is active at server
#
#parameters: none
#returns: none
################################
def checkActive():
	global active

	#url components
	urlPost = {'unit':unit}
	
	#create the encoded post data
	data = urllib.urlencode(urlPost)
	
	#submit the request
	request = urllib2.Request(getActiveURL, data)

	#get the reponse
	try:
		response = urllib2.urlopen(request).read()
        except:
                return

	
	#return reponse
	try: 
	    active = int(response)
	except:
	    return;
	return;


#################################
#checkRequest
#check for any requests
#
#parameters: none
#returns: none
################################
def checkRequest():
	global request

	#url components
	urlPost = {'unit':unit}
	
	#create the encoded post data
	data = urllib.urlencode(urlPost)
	
	#submit the request
	request = urllib2.Request(pendingRequestsURL, data)

	#get the reponse
	try:
		response = urllib2.urlopen(request).read()	
        except:
                return

	#return reponse 
	try:
	    request = int(response)
	except:
	    return
	return;



#perform initialization
init()
loop()

