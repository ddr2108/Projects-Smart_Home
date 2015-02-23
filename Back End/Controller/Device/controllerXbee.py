import serial
import time
import threading
from threading import Thread
import MySQLdb

#Packet Types
INIT = 1
ID = 2
UPDATE = 3
ALIVE = 4
INFO = 5

#Device Types
LIGHT = 1
PLUG = 2
TEMP = 3
MOTION = 4 

#Address
coordID = 0

#serial connection Info
PORT = '/dev/ttyUSB0'
BAUD = 9600

#packets
rcvPacket = ''
sendPacket = ''

#database stuff
HOST  = "localhost"
USER = "root"
PW = "siddhartha"
DB = "Smart_Home"

#database variables
curDB = ''
db = ''

#ID of device
initID = 0
curID  = 0

#locking between threads
lockPkt = threading.Lock()
lockDB = threading.Lock()
######################################

####################################
#processData
#take incoming packet and process
#
#parameters: none
#returns: none
####################################
def processData():
    global rcvPacket
    #check for length of packet
    if len(rcvPacket)<4:
	rcvPacket = ''
	return

    #check type of packet
    if ord(rcvPacket[2])==INIT:		#init packet	
	processDevices()
    if ord(rcvPacket[2])==INFO:
	processInfo()
    rcvPacket = ''	#clear buffer
    return


#################################
#processDevices
#process the devices and save
#
#parameters: none
#returns: none
################################
def processDevices():
    global initID, curID
    
    #get the initial id
    initID = ord(rcvPacket[1])

    #get the new id
    lockDB.acquire()
    try:
    	command = "INSERT INTO Device_List(id) VALUES('0')"
    	curDB.execute(command)
    	curID = int(db.insert_id())

    	#process devices into db
    	numDevices = len(rcvPacket)-4
    	for i in range(0,numDevices):
		device =  ord(rcvPacket[3+i])
   		command = "INSERT INTO Devices(Device, Name, State, Type, Value1, Value2, Time) VALUES('" + str(curID)  +  "', 'new', '0','" + str(device) + "', '0', '0', '0')"
		curDB.execute(command)
    	db.commit()
    finally:
	lockDB.release()

    #send packets about new id and data
    createIDDataPacket()
    time.sleep(1)
    createAlertDataPacket(curID)         #ask for info

    return


###################################
#processInfo
#pulls out info sent from device
#
#parameters: none
#returns: none
###################################
def processInfo():
    global rcvPacket

    #take data and update db
    command = "UPDATE Devices SET State=" + str(ord(rcvPacket[4]))  + ", Value1=" + str(ord(rcvPacket[5]))  +  ", Value2=" + str(ord(rcvPacket[6])) + ", Time=" + str(time.time())  + " WHERE Device= " + str(ord(rcvPacket[1]))  + " AND TYPE=" + str(ord(rcvPacket[3]))
    
    lockDB.acquire()
    try:
    	curDB.execute(command)
    	db.commit()   
    finally:
    	lockDB.release()
    return

###################################
#createIDDataPacket
#creates a packet for sending id
#
#parameters: none
#returns: none
##################################
def createIDDataPacket():
    global sendPacket
    
    lockPkt.acquire()
    try:
    	#create packet
    	sendPacket = str(chr(initID)) + str(chr(coordID)) + str(chr(ID)) + str(chr(curID)) + '\n'
    	#send data
    	sendData()
    finally:
	lockPkt.release()
    return

###################################
#createAlertDataPacket
#creates a packet for requesting data
#
#parameters: id
#returns: none
###################################
def createAlertDataPacket(id):
    global sendPacket
    lockPkt.acquire()
    try:
    	#create packet
    	sendPacket = str(chr(id)) + str(chr(coordID)) + str(chr(ALIVE)) + '\n'
    	#send data
   	sendData()
    finally:
	lockPkt.release()
    return

################################
#sendData
#sends data out
#
#parameters: none
#returns: none
#################################
def sendData():
    global sendPacket

    #send data
    ser.write(sendPacket)
    return

################################
#checkForUpdates
#checks the database for updates
#
#parameters: none
#returns: none
#################################
def checkForUpdates():
    lockDB.acquire()
    try:
    	#get updates
    	command = "SELECT * FROM Updates"
    	a= curDB.execute(command)
   	
	#call fx to handle
    	for x in range(0, curDB.rowcount):
	    row = curDB.fetchone()
	    if (row is not None):
	        devUpdate(row)
    	    
	#delete updates
    	command = "DELETE FROM Updates"
    	curDB.execute(command)
    	db.commit()
    finally:
	lockDB.release()
    return;

################################
#devUpdate
#send packet for updating
#
#parameters: none
#returns: none
#################################
def devUpdate(row):
    global sendPacket;
    
    lockPkt.acquire()
    try: 
    	#create packet
    	sendPacket = str(chr(row[0])) + str(chr(coordID)) + str(chr(UPDATE)) + str(chr(row[2])) + str(chr(row[1])) + str(chr(row[3])) + str(chr(row[4])) +  '\n'
    	#send the data
    	sendData()
    finally:
	lockPkt.release()
    return;

################################
#checkAlive
#check for Alive packets
#
#parameters: none
#returns: none
#################################
def checkAlive():
    #get time
    curTime = time.time()

    lockDB.acquire()
    try:
        #get updates
        command = "SELECT * FROM Devices WHERE Time<"+str(curTime-100)
        curDB.execute(command)
        #call fx to ask for data
        for x in range(0, curDB.rowcount):
            row = curDB.fetchone()
	   # createAlertDataPacket(row[0])

        #change old to objects
       	command = "UPDATE Devices SET Time='0' WHERE Time<"+str(curTime-200)
        curDB.execute(command)
        db.commit()
    finally:
        lockDB.release()
    
    #sleep
    time.sleep(0.5)
    
    return

################################
#init
#initialize stuff
#
#parameters: none
#returns: none
###############################
def init():
    global ser
    global curDB
    global db

    #open serial connection
    ser = serial.Serial(PORT, BAUD)

    #open db connection 
    db = MySQLdb.connect(host=HOST,
			user=USER,
			passwd=PW,
			db=DB) 
    curDB = db.cursor()

    return

###############################
#loopRcv
#loop program is in for recv
#
#parameters: none
#returns: none
##################################
def loopRcv():
    global rcvPacket

   #get data and process
    while True:
	rcvPacket = ser.readline()
	processData()
    return;

###############################
#loopUpdate
#loop program is in for updates
#
#parameters: none
#returns: none
##################################
def loopUpdate():
    #check db for updates
    while True:
	checkForUpdates()
    return

###############################
#loopAlive
#loop program to check aliveness
#
#parameters: none
#returns: none
##################################
def loopAlive():
    while True:
	checkAlive()
    return

###############################
#loop
#loop program is in for
#
#parameters: none
#returns: none
##################################
def loop():
    #call all loops
    t1 = threading.Thread(target=loopRcv, args=[])
    t2 = threading.Thread(target=loopUpdate, args=[])
    t3 = threading.Thread(target=loopAlive, args=[])

    #start threads
    t1.start()
    t2.start()
    t3.start()
    return;
#######################################

#initialize
init()
#loop
loop()
