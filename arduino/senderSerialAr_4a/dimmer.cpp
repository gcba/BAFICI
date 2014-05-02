//
// dimmer.cpp
// Class library C++ code
// ----------------------------------
// Developed with embedXcode
// http://embedXcode.weebly.com
//
// Project 		testArduino_Clases
//
// Created by 	Cristian, 4/7/14 5:23 PM
// 				Cristian
//
// Copyright 	© Cristian, 2014
// License     <#license#>
//
// See 			dimmer.h and ReadMe.txt for references
//


// Library header
#include "dimmer.h"

// Code
dimmer::dimmer() {
    valueOn=0;
    valueOff=0;
    interval=10;
    previousMillis=0;
    ledState=LOW;
}

void dimmer::on(int analogPin, int time, int digitalPin){
    
    int valueButton=digitalRead(digitalPin);

    if (valueButton==HIGH) {
        
        unsigned long currentMillis=millis();
        
        if (currentMillis-previousMillis>interval) {
            previousMillis=currentMillis;
            valueOn+=5;
            if (valueOn>=255) {
                valueOn=255;
            }
        }
        
        analogWrite(analogPin, valueOn);
        
        
    }
    else{
        valueOn=0;

        analogWrite(analogPin, valueOff);
    }
}
