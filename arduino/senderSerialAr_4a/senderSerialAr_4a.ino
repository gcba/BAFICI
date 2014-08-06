// 
// testArduino_Clases 
//
// Mesa Bafici
// Developed with [embedXcode](http://embedXcode.weebly.com)
// 
// Author	 	Cristian
// 				Cristian
//
// Date			4/7/14 5:23 PM
// Version		<#version#>
// 
// Copyright	© Cristian, 2014
// License		<#license#>
//
// See			ReadMe.txt for references
//


#include "Arduino.h"
#include "dimmer.h"

#define ARRAY_SIZE 6

int myLed=13;
int timerOn=800;
int timerOff=50;


int ledPin[]={7, 6, 5, 4, 3, 2};
int sensorPin[]={30, 32, 34, 36, 38, 40};
int valSensor[ARRAY_SIZE];
int value[ARRAY_SIZE];


dimmer led[ARRAY_SIZE];


void setup() {
  Serial.begin(115200);
    for (int i=0; i<ARRAY_SIZE; i++) {
          pinMode(ledPin[i], OUTPUT);
    }
    for (int i=0; i<ARRAY_SIZE; i++) {
        pinMode(sensorPin[i], INPUT);
    }

}


void loop() {

  
    for (int i=0; i<ARRAY_SIZE; i++) {
        led[i].on(ledPin[i], 0, sensorPin[i]);
        value[i]=digitalRead(sensorPin[i]);

   
    }
    
    Serial.print(value[0], DEC);
    Serial.print(",");
    Serial.print(value[1], DEC);
    Serial.print(",");
    Serial.print(value[2], DEC);
    Serial.print(",");
    Serial.print(value[3], DEC);
    Serial.print(",");
    Serial.print(value[4], DEC);
    Serial.print(",");
    Serial.print(value[5], DEC);
    Serial.print(",");
    Serial.println();
    delay(50);
         
}
