/* Con la clase MeesageOSC recibo los valores desde Arduino y los envío utilizando el protocolo 
 OSC a node.js. 
 */

class MessageOSC {

  int index;
  boolean bFlag;
  int minCounter;
  int maxCounter;
  float incrementVal;
  float counter;
  int temp;
  boolean bPrinter=false;


  MessageOSC(int cindex, int cminCounter, int cmaxCounter, float cincrementVal) {

    index=cindex;
    minCounter=cminCounter;
    maxCounter=cmaxCounter;
    incrementVal=cincrementVal;
  }

  //La función sendOSC recibe un booleano según el estado del sensor.

  void sendOSC(boolean cbFlag) {
    int trueVal=1;
    int falseVal=0;
    bFlag=cbFlag;


    //Declaro los tags de los mensajes OSC
    String sensorValue= "/sensor_";
    String bSensor="/bSensor_";

    String[] bMessage= new String [2];
    bMessage[0]=bSensor;
    bMessage[1]=nf(index, 1);
    String tagFlag= join(bMessage, "");

    String[] valMessage= new String [2];
    valMessage[0]=sensorValue;
    valMessage[1]=nf(index, 1);
    String tagSensorValue= join(valMessage, "");

    //Si el botón es pulsado incremento una variable que será enviada a node.js

    if (bFlag) {
      counter+=incrementVal;

      int cCounter= int(constrain(counter, minCounter, maxCounter));
      OscMessage myMessage = new OscMessage(tagFlag);
      myMessage.add(trueVal);
      oscP5.send(myMessage, myRemoteLocation);

      OscMessage valueMessage= new OscMessage(tagSensorValue);
      valueMessage.add(cCounter);
      oscP5.send(valueMessage, myRemoteLocation);

      temp=int(constrain(counter, minCounter, maxCounter));
      bPrinter=true;
    }
    else {

      //Cuando el botón deja de ser pulsado guardo el valor en memoria para luego volvar al .txt
      if (bPrinter) {
        output.println(hour()+":"+minute()+":"+second()+","+tagFlag+"," + temp);
        bPrinter=false;
      }

      //Si el botón no es pulsado envío un mensaje de valor 0 (cero) de forma contínua.

      counter=0;
      OscMessage myMessage = new OscMessage(tagFlag);
      myMessage.add(falseVal);
      oscP5.send(myMessage, myRemoteLocation);
    }
  }
}

