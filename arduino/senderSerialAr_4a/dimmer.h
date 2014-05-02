//
// File			dimmer.h
// Class library header
//
// Details		<#details#>
//
// Project	 	testArduino_Clases
// Developed with [embedXcode](http://embedXcode.weebly.com)
//
// Author		Cristian
// 				Cristian
//
// Date			4/7/14 5:23 PM
// Version		version
//
// Copyright	© Cristian, 2014
// License	    <#license#>
//
// See			ReadMe.txt for references
//


#ifndef dimmer_h
#define dimmer_h

#include "Arduino.h"


class dimmer {
  
public:
  dimmer();
    int valueOn, valueOff;
    void on(int, int, int);
    long interval;
    long previousMillis;
    
    boolean ledState;
    
private:
};

#endif
