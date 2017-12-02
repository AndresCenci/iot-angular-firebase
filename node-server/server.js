const Firestore = require('@google-cloud/firestore');
var five = require("johnny-five");

const firestore = new Firestore({
  projectId: 'PROJECTID',
  keyFilename: 'PATH_TO_KEY.json',
});

const document = firestore.doc('FIRESTORE_DOCUMENT');

five.Board({port: 'COM2'}).on("ready", function() {
  var maxValue = 511;
  var colRange = 6;
  var offset   = maxValue / colRange;

  // Create a new led instance
  var led = new five.Led(13);
  // Blink every half second
  led.blink(500);

  // Create a new pot instance
  var pot = new five.Sensor({
    pin: "A0",
    freq: 200
  });

  // Create a new led array based on pin number
  var ledArray = new five.Led.Array([11, 10, 9]);

  // Listen on data change
  pot.on("data", function() {

    var self = this.value;
    // Print pot value 
    console.log(self);

    // Map dynamic color brightness to pot value
    // RED - MAGENTA - BLUE
    var redDec   = Math.round(five.Fn.map(self, offset, offset*2, 255, 0));
    var blueInc  = Math.round(five.Fn.map(self, 0, offset, 0, 255));
    // BLUE - CYAN - GREEN
    var blueDec  = Math.round(five.Fn.map(self, offset*3, offset*4, 255, 0));
    var greenInc = Math.round(five.Fn.map(self, offset*2, offset*3, 0, 255));
    // GREEN - YELLOW - RED
    var greenDec = Math.round(five.Fn.map(self, offset*5, offset*6, 255, 0));
    var redInc   = Math.round(five.Fn.map(self, offset*4, offset*5, 0, 255));

    // Adjusting color brightness conditionally based on 
    // the location of the pot output value.
    switch (true) {
      case (self > 0 && self <= offset):
        console.log("1st loop");
        ledArray[0].brightness(255);
        ledArray[2].brightness(blueInc);
        ledArray[1].brightness(0);
        document.update({
          r: 255,
          g: 0,
          b: blueInc
        }).then(() => {
          console.log('Color updated successfully.')
        });
        break;
      case (self > offset && self <= offset*2):
        console.log("2nd loop");
        ledArray[0].brightness(redDec);
        ledArray[2].brightness(255);
        ledArray[1].brightness(0);
        document.update({
          r: redDec,
          g: 0,
          b: 255
        }).then(() => {
          console.log('Color updated successfully.')
        });
        break;
      case (self > offset*2 && self <= offset*3):
        console.log("3rd loop");
        ledArray[0].brightness(0);
        ledArray[2].brightness(255);
        ledArray[1].brightness(greenInc);
        document.update({
          r: 0,
          g: greenInc,
          b: 255
        }).then(() => {
          console.log('Color updated successfully.')
        });
        break;
      case (self > offset*3 && self <= offset*4):
        console.log("4th loop");
        ledArray[0].brightness(0);
        ledArray[2].brightness(blueDec);
        ledArray[1].brightness(255);
        document.update({
          r: 0,
          g: 255,
          b: blueDec
        }).then(() => {
          console.log('Color updated successfully.')
        });
        break;
      case (self > offset*4 && self <= offset*5):
        console.log("5th loop");
        ledArray[0].brightness(redInc);
        ledArray[2].brightness(0);
        ledArray[1].brightness(255);
        document.update({
          r: redInc,
          g: 255,
          b: 0
        }).then(() => {
          console.log('Color updated successfully.')
        });
        break;
      case (self > offset*5 && self <= offset*6):
        console.log("6th loop");
        ledArray[0].brightness(255);
        ledArray[2].brightness(0);
        ledArray[1].brightness(greenDec);
        document.update({
          r: 255,
          g: greenDec,
          b: 0
        }).then(() => {
          console.log('Color updated successfully.')
        });
        break;
      default:
        console.log("Out of range");
        ledArray[0].brightness(255);
      	ledArray[2].brightness(0);
	ledArray[1].brightness(0);
        document.update({
          r: 255,
          g: 0,
          b: 0
        }).then(() => {
          console.log('Color updated successfully.')
        });
    }
  });
});
