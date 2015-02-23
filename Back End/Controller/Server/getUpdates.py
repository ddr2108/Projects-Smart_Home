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
		if (response is not None and len(response)>=5):
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
	try:
		response = urllib2.urlopen(request).read()
	except:
		return

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
		#check if there is enough data
		if (len(updates)-i)<5:
			return	

		#create command
		command = "INSERT INTO Updates(Device, State, Type, Value1, Value2) VALUES('"+updates[0+i]+"','"+updates[1+i]+"','"+updates[2+i]+"','"+updates[3+i]+"','"+updates[4+i]+"')"
		
		#insert into db
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
		print command
	return

#perform initialization
init()
loop()
