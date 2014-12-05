import urllib2
import urllib
import MySQLdb

#database stuff
HOST  = "localhost"
USER = ""
PW = ""
DB = "Smart_Home"

#server
pendingUpdatesURL = 'http://deepdattaroy.com/other/projects/Services/SmartHome/update/pendingUpdates.php'

#database variables
curDB = ''
db = ''

#Device settings
unit = 0

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
		response = checkUpdates()
		processUpdates(response)
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
#checkUpdates
#check for any updates
#
#parameters: none
#returns: 
#	response - data from server
################################
def checkUpdates():
	#url components
	urlPost = {'unit':unit}

	#create the encoded post data
	data = urllib.urlencode(urlPost)
	
	#submit the request
	request = urllib2.Request(pendingUpdatesURL, data)

	#get the reponse
	response = urllib2.urlopen(request).read()
	
	#return reponse split by delimiter
	return response.split(':')

#################################
#processUpdates
#check for any updates
#
#parameters: 
#	updates - updates to do
#returns: none
################################
def processUpdates(updates):
	#go through received data
	for i in range(0, len(updates)-1,5):
		#create command
		command = "INSERT INTO Updates(Device, State, Type, Value1, Value2) VALUES('"+updates[0]+"','"+updates[1]+"','"+updates[2]+"','"+updates[3]+"','"+updates[4]+"')"
		#insert into db
		curDB.execute(command)
	    	db.commit()	
	return

#perform initialization
init()
loop()
