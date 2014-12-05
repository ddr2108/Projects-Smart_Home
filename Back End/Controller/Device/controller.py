import serial
import time
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

####
initID = 0
curID  = 5
###
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
    global initID

    #get the initial id
    initID = ord(rcvPacket[1])

    #process devices into db
    numDevices = len(rcvPacket)-4
    for i in range(0,numDevices):
	print '%d' % ord(rcvPacket[3+i])
    
    curDB.execute("INSERT INTO Devices(Name, State, Type, Value1, Value2, Time) VALUES('ab', '0','0', '0', '0', '0')")
    db.commit()

    #send packets about new id and data
    createIDDataPacket()
    time.sleep(1)
    createAlertDataPacket()         #ask for info

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
    print '%d' % ord(rcvPacket[3])
    print '%d' % ord(rcvPacket[4])
    print '%d' % ord(rcvPacket[5])
    print '%d' % ord(rcvPacket[6])
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
    
    #create packet
    sendPacket = str(unichr(initID)) + str(unichr(coordID)) + str(unichr(ID)) + str(unichr(curID)) + '\n'

    #send data
    sendData()
    return

###################################
#createAlertDataPacket
#creates a packet for requesting data
#
#parameters: none
#returns: none
###################################
def createAlertDataPacket():
    global sendPacket

    #create packet
    sendPacket = str(unichr(curID)) + str(unichr(coordID)) + str(unichr(ALIVE)) + '\n'
    #send data
    sendData()
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
#loop
#loop program is in
#
#parameters: none
#returns: none
##################################
def loop():
    global rcvPacket

   #get data and process
    while True:
	rcvPacket = ser.readline()
   	processData()

    return;


#######################################

#initialize
init()
#loop
loop()
