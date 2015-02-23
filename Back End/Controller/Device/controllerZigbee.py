#/usr/bin/python
from apscheduler.scheduler import Scheduler
from xbee import ZigBee 
import time
import serial
import sys
import shlex
import MySQLdb
import threading
from threading import Thread

#Device Types
LIGHT = 1
PLUG = 2
TEMP = 3
MOTION = 4 

#Address
coordID = 0

#serial connection Info
PORT = '/dev/ttyUSB1'
BAUD = 9600

#database stuff
HOST  = "localhost"
USER = "root"
PW = "siddhartha"
DB = "Smart_Home"

#database variables
curDB = ''
db = ''

#threading
scheditem = ''

#locking between threads
lockDB = threading.Lock()

#flag for determining if in starup phase
setupStart = 0
#################################################################################################G
################################
#init
#initialize stuff
#
#parameters: none
#returns: none
###############################
def init():
    global ser
    global zb
    global curDB
    global db
    global scheditem

    #open serial connection
    ser = serial.Serial(PORT, BAUD)

    #open db connection 
    db = MySQLdb.connect(host=HOST,
			user=USER,
			passwd=PW,
			db=DB) 
    curDB = db.cursor()

    #start scheduler
    scheditem = Scheduler()
    scheditem.start()

    #open xbee object
    zb = ZigBee(ser, callback=processData)

##############################
#processData
#process message recevied
#
#parameters:
#	data - data recv
#returns: none
#############################
def processData(data):
    global setupStart

    
    #check if valid packet - elser return
    if (data.has_key('cluster')==False):
	return    
	
    clusterId = (ord(data['cluster'][0])*256) + ord(data['cluster'][1])

    #device announcement - setup starting
    if (clusterId == 0x0013):
	setupStart = setupStart+1	#mark flag

    #capabilities info
    if (clusterId == 0x8005 and setupStart):
	setupStart = setupStart-1	#reset flag
	processDevices(data) #process new devices
	#if all devices have reset up, check for aliveness/update value
	#if (setupStart==0):
	checkAlive()

    #match descriptor request - answer if expected
    if (clusterId == 0x0006 and setupStart):
	#get address of device
	longAddr = data['source_addr_long']
	shortAddr = data['source_addr']

	#send active endpoint message
        sendPacket(longAddr,shortAddr,'\x00','\x00','\x00\x05','\x00\x00','\x00\x00')   
	#Match Descriptor Response
        sendPacket(longAddr, shortAddr, '\x00','\x00','\x80\x06','\x00\x00','\x00\x00\x00\x00\x01\x02')
        #hardware join messages
        sendPacket(longAddr,shortAddr,'\x00','\x02', '\x00\xf6','\xc2\x16','\x00\x00\x00\x00\x01\x02')
        sendPacket(longAddr,shortAddr,'\x00','\x02','\x00\xf0','\xc2\x16','\x19\x01\xfa\x00\x01')
        
        print 'Setup new device'
    
    #plug state
    if (clusterId==0x0006 and setupStart==0):
	state =  int(ord(data['rf_data'][3]))
	if (state==0 or state==1):
	    updateDevice(state, addrToString(data['source_addr_long']))
	
    if (clusterId==0xee):
	if (ord(data['rf_data'][2])==0x80):
	    if (ord(data['rf_data'][3]) & 0x01):
		state =  1
		updateDevice(state, addrToString(data['source_addr_long']))
	    else:
		state = 0
		updateDevice(state, addrToString(data['source_addr_long']))
	
#################################
#processDevices
#process the devices and save
#
#parameters: 
#	data - data recevied
#returns: none
################################
def processDevices(data):
    lockDB.acquire()
    try:
	#get address
	longAddr = addrToString(data['source_addr_long']) 
	shortAddr = addrToString(data['source_addr']) 

	#figure out type of device
        lengthData = len(data['rf_data'])       #get the length of data
	if (lengthData==4):     #plug
	    device = PLUG
        elif (lengthData==5):   #led bulb
	    device = LIGHT

    	#check if device already registered
    	command = "SELECT * FROM Zigbee_Addr WHERE Long_Addr='" +  longAddr + "'"
    	curDB.execute(command)

	#if it isn't registered
	if (curDB.rowcount==0):
	    #register the device
	    command = "INSERT INTO Device_List(id) VALUES('0')"
	    curDB.execute(command)
    	    curID = int(db.insert_id())

	    #save the address
	    command = "INSERT INTO Zigbee_Addr(Long_Addr, Short_Addr, Device) VALUES ('" + longAddr + "','"  + shortAddr + "','" + str(curID) + "')"
	    curDB.execute(command)
	    db.commit()

	    #record state
   	    command = "INSERT INTO Devices(Device, Name, State, Type, Value1, Value2, Time) VALUES('" + str(curID)  +  "', 'new', '0','" + str(device) + "', '0', '0', '" + str(time.time())  + "')"
	    curDB.execute(command)
	    db.commit()
    finally:
	lockDB.release()

################################
#updateDevice
#address will be converted to string
#
#parameters:
#       addr - original byte array
#returns: 
##################################
def updateDevice(state, addr):
    lockDB.acquire()
    try:
	#get device number
	command = "SELECT * FROM Zigbee_Addr WHERE Long_Addr='" +  addr + "'"
        curDB.execute(command)
        db.commit()
	if (curDB.rowcount==0):
		return
	row = curDB.fetchone()
	device = row[2]
	
	#udpate device
	command = "UPDATE Devices SET State='" + str(state) + "', Time='" + str(time.time()) + "'  WHERE Device='" + str(device)  + "'"
	curDB.execute(command)
	db.commit()
    finally:
	lockDB.release()

################################
#addrToString
#address will be converted to string
#
#parameters:
#	addr - original byte array
#returns:
#	string of address
##################################
def addrToString(addr):
    #create a string of the address
    hexified = ''
    for i in addr:
     	hexified += hex(ord(i))[2:].zfill(2)

    return hexified

################################
#stringToAddr
#address will be converted from string
#
#parameters:
#       stringAddr - string
#	bytes - number of bytes in addr
#returns:
#       byte array of addr
##################################
def stringToAddr(stringAddr, bytes):
    #intiial array
    unhexified = [0]*bytes

    #create the bytes
    for i in range(0,len(stringAddr),2):
        unhexified[i/2] = int(stringAddr[i]+stringAddr[i+1], 16)

    #return array of address
    return ''.join(chr(x) for x in unhexified)

########################################
#sendPacket
#send the data
#
#parameters:
#	longAddr - long address
#	shortAddr - short address
#	srcEndpoint - endpoint for src
#	destEndpoint - endpoint for dest
#	clusterID - clusted
#	profileID - profile
#	payload - data
#returns: none
##########################################
def sendPacket(longAddr, shortAddr, srcEndpoint, destEndpoint, 
                clusterID, profileID, payload):
    
    #send the packet
    zb.send("tx_explicit",
        dest_addr_long = longAddr,
        dest_addr = shortAddr,
        src_endpoint = srcEndpoint,
        dest_endpoint = destEndpoint,
        cluster = clusterID,
        profile = profileID,
        data = payload
        )


###########################
#checkForUpdates
#check if any update requested
#
#parameters: none
#returns: none
##########################
def checkForUpdates():
    lockDB.acquire()
    try:   
        #get updates
        command = "SELECT * FROM Zigbee_Addr INNER JOIN Updates ON Zigbee_Addr.Device=Updates.Device"
        curDB.execute(command)

        #call fx to handle
	entries = curDB.rowcount
        for x in range(0, entries):
	    row = curDB.fetchone()
   	    #update device
            devUpdate(row)
	if (entries>0):        
	#delete updates
            command = "DELETE Updates FROM Zigbee_Addr INNER JOIN Updates ON Zigbee_Addr.Device=Updates.Device"
            curDB.execute(command)
       
	db.commit()
    finally:
	lockDB.release()

###########################
#devUpdate
#process update
#
#parameters: 
#	row - row of update
#returns: none
##########################
def devUpdate(row):
    #call function for updating device
    if (row[5]==LIGHT):
	lightUpdate(row)
    elif (row[5]==PLUG):
	plugUpdate(row)

###########################
#lightUpdate
#process update for light
#
#parameters:
#       row - row of update
#returns: none
##########################
def lightUpdate(row):
    longAddr = stringToAddr(row[0],8)
    shortAddr = stringToAddr(row[1],2)
    state = row[4]

    #send packet
    lightPacket(longAddr, shortAddr, state)

###########################
#plugUpdate
#process update for plug
#
#parameters:
#       row - row of update
#returns: none
##########################
def plugUpdate(row):
    #get info about state
    longAddr = stringToAddr(row[0],8)
    shortAddr = stringToAddr(row[1],2)
    state = row[4]

    #send packet
    plugPacket(longAddr, shortAddr, state)
	
###########################
#plugPacket
#process update for plug
#
#parameters:
#       longAddr - long address
#	shortAddr - short address
#	state - new state
#returns: none
##########################
def plugPacket(longAddr, shortAddr, state):
    # Turn Switch Off
    if(state == 0):
        sendPacket(longAddr, shortAddr, '\x00', '\x02', '\x00\xee', '\xc2\x16', '\x11\x00\x01\x01')
        sendPacket(longAddr, shortAddr, '\x00', '\x02', '\x00\xee', '\xc2\x16', '\x11\x00\x02\x00\x01')

    # Turn Switch On
    if(state == 1):
        sendPacket(longAddr, shortAddr, '\x00', '\x02', '\x00\xee', '\xc2\x16', '\x11\x00\x01\x01')
        sendPacket(longAddr, shortAddr, '\x00', '\x02', '\x00\xee', '\xc2\x16', '\x11\x00\x02\x01\x01')


###########################
#lightPacket
#process update for light
#
#parameters:
#       longAddr - long address
#       shortAddr - short address
#       state - new state
#returns: none
##########################
def lightPacket(longAddr, shortAddr, state):
    #change to 50% brightness
    if(state == 2):
        sendPacket(longAddr, shortAddr, '\x00', '\x01', '\x00\x08', '\x01\x04', '\x01\x00\x04\x80\x00\x00\x00\x00\x10' )

    #turn off
    if (state == 0):
        sendPacket(longAddr, shortAddr, '\x00', '\x01', '\x00\x06', '\x01\x04', '\x01\x00\x00\x00\x10' )

    #turn on
    if (state == 1):
        sendPacket(longAddr, shortAddr, '\x00', '\x01', '\x00\x06', '\x01\x04', '\x01\x00\x01\x00\x10' )


#############################
#loopUpdate
#loop that updates devices
#
#parameters: 
#returns: none
#############################
def loopUpdate():
    while True:
	#sleep
        time.sleep(0.005)
        
	#check if updates pending
	checkForUpdates()

################################
#sendUpdatePacket
#send a packet requesting state
#
#parameters: 
#	row - row from db
#returns: none
#################################
def sendUpdatePacket(row):
    longAddr = stringToAddr(row[0], 8)
    shortAddr = stringToAddr(row[1], 2)
    state = row[5]
    if(row[6]==LIGHT):
	lightPacket(longAddr, shortAddr, state)
    elif(row[6]==PLUG):
        plugPacket(longAddr, shortAddr, state)


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

	command = "SELECT * FROM Zigbee_Addr INNER JOIN Devices ON Zigbee_Addr.Device=Devices.Device"
    	curDB.execute(command)
    	#call fx to ask for data
    	for x in range(0, curDB.rowcount):
           row = curDB.fetchone()
	   sendUpdatePacket(row)
    	#change old objects timestamp
    	command = "UPDATE Devices INNER JOIN Zigbee_Addr ON Zigbee_Addr.Device=Devices.Device SET Time=0 WHERE Time<"+str(curTime-1800)
    	curDB.execute(command)
    	db.commit()
    
    finally:
	lockDB.release()

    return

#############################
#loopAlive
#loop that polls devices
#
#parameters:
#returns: none
#############################
def loopAlive():
    #check if alive
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
    global scheditem

    #start tasks
    scheditem.add_interval_job(loopAlive, seconds=100)

    #call all loops
    loopUpdate()
   
    return;


#############################################################################################


#run program
try:
    init()
    loop()
except:
    print "Unexpected error:", sys.exc_info()[0]

#close connections
zb.halt()
ser.close()

