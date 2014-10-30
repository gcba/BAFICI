PrintWriter output, o1, o2, o3,o4;


int j=0;
void setup() {
  size(100, 200);
}


void draw() {
  background(120, 120, 120);
  j=j+10;
  int k=mouseY;


  if (key=='f') {
    o1 = createWriter("../../public/datos/innovatiba_0.csv");
    delay(15);
    o1.println("sensor"+","+"valor");
    for (int i=0;i<6;i++) {
      String sensor="/bSensor_";
      o1.println(sensor+i+","+str(k));
    }


    o1.flush(); 
    o1.close(); 
  }
  
  if (key=='g') {
    o2 = createWriter("../../public/datos/innovatiba_1.csv");
    delay(15);
    o2.println("sensor"+","+"valor");

    for (int i=0;i<6;i++) {
      String sensor="/bSensor_";
      o2.println(sensor+i+","+str(k));
    }
    o2.flush(); 
    o2.close(); 
  }
  
  if (key=='h') {
    o3 = createWriter("../../public/datos/innovatiba_2.csv");
    delay(15);
    o3.println("sensor"+","+"valor");

    for (int i=0;i<6;i++) {
      String sensor="/bSensor_";
      o3.println(sensor+i+","+str(k));
    }
    o3.flush(); 
    o3.close(); 
  }
  
   
  if(key=='e'){
    exit();
  }
   
}

