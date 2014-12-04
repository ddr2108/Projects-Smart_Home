#include "TimerOne.h"
#include <dht.h>

//Serial setup
#define BAUD_RATE  9600

//Unique id for device
int coordID = 0;
int deviceID = 0;

//Packet types
#define INIT 1
#define ID 2
#define UPDATE 3
#define ALIVE 4
#define INFO 5

//Packets
String sendPacket = "";
String rcvPacket = "";

//Device types
#define ALL -1
#define LIGHT 1
#define PLUG 2
#define TEMP 3
#define MOTION 4

//Refresh rate for devices
#define REFRESH_RATE 10000000

/////////////////DEVICES//////////////////////////////////
//Devices
int devicesActive[] = {TEMP, PLUG};

//Temp Sensor
#define dht_dpin A0 
//Temp sensor strcture
dht DHT;

//Plug
#define PLUG_PIN 13
//State
int plugState = 1;
///////////////////////////////////////////////////////////

/************************************
* setup
* initialize timer and serial interface
*
* parameters: none
* returns: none
*************************************/
void setup(){
  //Begin serial interface at proper baud rate
  Serial.begin(BAUD_RATE);
  
  //timer to send data
  Timer1.initialize(REFRESH_RATE);         // initialize timer1, and set a 1/2 second period
  Timer1.attachInterrupt(sendThread);  // attaches callback() as a timer overflow interrupt
  
  //add intial delay for setup
  delay(2000);
  deviceSetup();

}

/************************************
* loop
* main processing loop
*
* parameters: none
* returns: none
*************************************/
void loop(){

  initialSetup();  //if never set up   
  recvData();      //try to receive data
  processData();    //process any received data
  deviceProcessing();  //get data from sensor

}

/************************************
* deviceSetup
* Setups all the devices
*
* parameters: none
* returns: none
*************************************/
void deviceSetup(){
    //go through all devices
    for (int i = 0; i<sizeof(devicesActive)/sizeof(int); i++){
      if (devicesActive[i]==TEMP){  //temp senor
        DHT.read11(dht_dpin);    //read tempearture
      }else if (devicesActive[i]==PLUG){  //plug
        pinMode(PLUG_PIN, OUTPUT);  //set up inial input
        digitalWrite(PLUG_PIN, plugState);    
      }  
    }

}

/************************************
* deviceProcessing
* Processes all the devices
*
* parameters: none
* returns: none
*************************************/
void deviceProcessing(){
      //go through all devices
    for (int i = 0; i<sizeof(devicesActive)/sizeof(int); i++){
      if (devicesActive[i]==TEMP){  //temp senor
        DHT.read11(dht_dpin);    //read tempearture
      } 
    }
}

/************************************
* initialSetup
* Initial Setup of device with server
*
* parameters: none
* returns: none
*************************************/
void initialSetup(){
    //never given an id
  if (deviceID==0){
    //random number generated
    randomSeed(analogRead(1));
    deviceID = random(255);  //temp id
    
    //create packet to request id
    sendPacket+=(char)coordID;  //destination coordinator
    sendPacket+=(char)deviceID; //src unknown
    sendPacket+=(char)INIT;  //packet type 
    
    //state devices
    for (int i = 0; i<sizeof(devicesActive)/sizeof(int); i++){
     sendPacket+=(char)devicesActive[i]; 
    }
    
    //termionating
    sendPacket+=(char)'\n';  //packet type 
    
    //send the data
    sendData();
  }
}

/************************************
* recvData
* receive data from controller
*
* parameters: none
* returns: none
*************************************/
void recvData(){
  // read data incoming
  while (Serial.available() > 0) {
    //delay to allow buffer to fill
    delay(3);  
      
    //read incoming byte
    char incomingByte = Serial.read();
    rcvPacket += incomingByte;
  }
}

/************************************
* processData
* Processes data to determine what is
* requested
*
* parameters: none
* returns: none
*************************************/
void processData(){
  
  //Process packet
  if (parseMsgComp(rcvPacket.substring(0,1))==deviceID){    //packet to this device
   if (parseMsgComp(rcvPacket.substring(1,2))==coordID){    //packet from coordinator

      //Types of packets
      if (parseMsgComp(rcvPacket.substring(2,3))==ID){    //packet giving new id
         deviceID = parseMsgComp(rcvPacket.substring(3,4));
      }
      if (parseMsgComp(rcvPacket.substring(2,3))==ALIVE){    //packet giving new id
         createDataPacket(ALL);
      }
      if (parseMsgComp(rcvPacket.substring(2,3))==UPDATE){    //packet giving new id
         processUpdate();
      }
   }
  }
  //Done processing packet
  rcvPacket = "";
}

/************************************
* praseMsgComp
* get the integer from the msg 
*
* parameters: 
*  String msg - part of msg to parse
* returns: none
*************************************/
int parseMsgComp(String msg){
  char parseMsg[2];

  //cover to char array
  msg.toCharArray(parseMsg, 2);

  //return data
  return parseMsg[0];
}

/************************************
* sendData
* Send data in buffer 
*
* parameters: none
* returns: none
*************************************/
void sendData(){
  //send data
  Serial.print(sendPacket);
  //clear packet
  sendPacket = "";
}

/************************************
* sendThread
* sends data periodically 
*
* parameters: none
* returns: none
*************************************/
void sendThread(){

  //only send if setup
  if (deviceID!=0){
    //create the data packet
    createDataPacket(ALL);
  }

}

/************************************
* createDataPacket
* Creates a data packet to send 
*
* parameters: 
*  int device - device to send info
* returns: none
*************************************/
void createDataPacket(int device){
    if (device==TEMP || device==ALL){
      createTempDataPacket();
      sendData();
    }
    if (device==PLUG || device==ALL){
      createPlugDataPacket();
      sendData();
    }

}

/************************************
* createTempDataPacket
* Creates a data packet to send 
*
* parameters: none
* returns: none
*************************************/
void createTempDataPacket(){
      //create packet for data
    //header
    sendPacket+=(char)coordID;  //destination coordinator
    sendPacket+=(char)deviceID; //src unknown
    sendPacket+=(char)INFO;  //packet type

    //data
    sendPacket+=(char)TEMP; 
    sendPacket+=(char)0; 
    sendPacket+=(char)(int)(DHT.temperature*9/5+32); 
    sendPacket+=(char)(int)DHT.humidity;     

    //terminal
    sendPacket+=(char)'\n';  //packet type 
}

/************************************
* createPlugDataPacket
* Creates a data packet to send 
*
* parameters: none
* returns: none
*************************************/
void createPlugDataPacket(){
      //create packet for data
    //header
    sendPacket+=(char)coordID;  //destination coordinator
    sendPacket+=(char)deviceID; //src unknown
    sendPacket+=(char)INFO;  //packet type

    //data
    sendPacket+=(char)PLUG; 
    sendPacket+=(char)plugState; 
    sendPacket+=(char)0; 
    sendPacket+=(char)0;     

    //terminal
    sendPacket+=(char)'\n';  //packet type 
}

/************************************
* processUpdate
* process an update request from controller 
*
* parameters: none
* returns: none
*************************************/
void processUpdate(){
  if (parseMsgComp(rcvPacket.substring(3,4))==TEMP){
    createDataPacket(TEMP);
  }
  if (parseMsgComp(rcvPacket.substring(3,4))==PLUG){
    processPlugUpdate();
    createDataPacket(PLUG);
  }
}

/************************************
* processPlugUpdate
* updates plug state 
*
* parameters: none
* returns: none
*************************************/
void processPlugUpdate(){
  //change plug state
  plugState = parseMsgComp(rcvPacket.substring(4,5));
  
  //update device
  digitalWrite(PLUG_PIN, plugState);  
}


