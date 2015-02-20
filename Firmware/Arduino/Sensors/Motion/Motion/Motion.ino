#include <avr/wdt.h>
#include < avr/interrupt.h >

//Device Types
#define DOOR 5

//Motion Sensor
#define MOTION_PIN 2
//State
volatile int moitionState;

//Door Sensor
#define DOOR_PIN 8
//State
volatile int doorState;

#define LED	13//the LED is connected to D4 of Arduino



//watchdog

/********************************
*ISR(INT0_vect)
*ISR for Motion sensor
**********************************/
void motionChange() {
  // check the value again - since it takes some time to
  // activate the interrupt routine, we get a clear signal.
  //moitionState = ~moitionState;
  Serial.println("Hi");
}

/********************************
*ISR(INT1_vect)
*ISR for Door sensor
**********************************/
void doorChange() {
  // check the value again - since it takes some time to
  // activate the interrupt routine, we get a clear signal.
  doorState = ~doorState;
    Serial.println("hello");

}


void setup()
{
  Serial.begin(9600);
        //Set pin mode
	pinMode(MOTION_PIN, INPUT);
	pinMode(DOOR_PIN, INPUT);
	pinMode(LED,OUTPUT);

      //set up pin for door
      digitalWrite(DOOR_PIN, HIGH);    // Activate internal pullup resistor

  //set up interrupt
   attachInterrupt(0, motionChange, CHANGE);}

void loop() 
{
	if(isPeopleDetected())//if the sensor detects movement, turn on LED.
	  digitalWrite(LED,HIGH);
	else//if the sensor does not detect movement, do not turn on LED.
	  digitalWrite(LED,LOW);

  //Serial.println(digitalRead(DOOR_PIN));  // Display current value
  delay(200);

}

boolean isPeopleDetected()
{
	int sensorValue = digitalRead(MOTION_PIN);
	if(sensorValue == HIGH)//if the sensor value is HIGH?
	{
		return true;//yes,return true
	}
	else
	{
		return false;//no,return false
	}
}
