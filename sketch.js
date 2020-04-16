/*
 Music player
Plays a directory of music

created by Tom Igoe
5 Feb 2017
*/


// serial stuff start /////////////////////////////////////////////////////////////////////////////

// Declare a "SerialPort" object
var serial;
// fill in the name of your serial port here:
var portName = "/dev/ttyACM0";
var circleSize = 50;

// serial stuff end /////////////////////////////////////////////////////////////////////////////
let textXpos = 10;
var song;		// the sound file to be played

// the list of songs:
var songs = ['haircutsformen_1.mp3','haircutsformen_2.mp3','haircutsformen_3.mp3','haircutsformen_4.mp3','haircutsformen_5.mp3'];

var songCount = songs.length; // number of songs in the music dir
var currentSong = 0;          // current song number

function preload() {          // load the first song on preload
 song = loadSound('data/' + songs[currentSong]);
}

//Video overlay////
var vid;



function setup() {
  createCanvas(1920,1080);

  // make an instance of the SerialPort object
  serial = new p5.SerialPort(document.location.hostname);

  // set callback functions for list and data events:
  serial.on('list', printList);
  serial.on('data', serialEvent);
  // open the serial port:
  serial.open(portName);



  button = createButton('play');
  button.mousePressed(toggle);
  button2 = createButton('next');
  button2.mousePressed(next);


  //video setup//////
  
  vid = createVideo("video/test.mp4");
  //vid.position(50,50);//
  vid.play();
  vid.loop();
  

}

function toggle(){
   controlSound(50);
}

function next(){
   controlSound(51);
}
  

// serial functions start /////////////////////////////////////////////////////////////////////////////

function serialEvent() {
  // read a line of text in from the serial port:
  var data = serial.readLine();
  console.log(data);
  // if you've got a valid line, convert it to a number:
  if (data.length > 0) {
    circleSize = int(data);
  }
  // send a byte to the microcontroller
  // to prompt it to respond with another reading:
  serial.write("x");
}
 
function printList(portList) {
  // portList is an array of serial port names:
  for (var i = 0; i < portList.length; i++) {
    console.log(i + ' ' + portList[i]);
  }
}

// serial functions end /////////////////////////////////////////////////////////////////////////////



// DRAW FUNCTION ////////////////////////////////////////////////////////////////////////////////////

function draw() {
  background(30, 20, 180);
  
  image(vid, 50, 50);
  //vid.loop();//
  
  fill(255);
  textSize(15);
  textFont('Helvetica');
  // draw the song's name and current time in seconds:
  text(songs[currentSong], 65, 75);
  text(song.currentTime().toFixed(3), 65, 125);
  song.setVolume(circleSize/100);
  text("VOLUME: " + circleSize, 65, 175);
  
  
  
   if (circleSize < 50){
   filter(INVERT);
  }

}


function controlSound(input) {
  switch(input) {
    case 49:   // start/stop, press 1
      if (song.isPlaying()){
        song.stop();
      } else {
        song.play();
      }
      break;
    case 50:   // play/pause, press 2
      if (song.isPlaying()){
        song.pause();
      } else {
        song.play();
      }
      break;
    case 51:    // skip ahead, press 3
      // make sure the song number is valid, and increment:
      if (currentSong < songs.length-1) {
        currentSong++;
      } else {
        currentSong = 0;
      }
      // get new song:
      getSong(currentSong);
      break;
    case 52:    // skip back, press 4
      // in the first second, just rewind the current track:
      if (song.currentTime() > 1.0) {
        song.jump(0);
      // if more than a second has elapsed, then
      // make sure the song number is valid, and decrement:
      } else {
        if (currentSong > 0) {
          currentSong--;
        } else {
          currentSong = songs.length-1;
        }
        // get new song:
        getSong(currentSong);
      }
      break;
    case 53:    // fast forward, press 5
        song.rate(2.0);   // double the play speed
      if (!song.isPlaying()){
        song.play();
      }
      break;
    case 54:    // random song, press 6
      currentSong = Math.round(random(songCount));  // get a new song number
      getSong(currentSong);             // play it
      break;
  }
}

function getSong(songNumber) {
  if (songNumber < songs.length) {   // if the song number is in range
    if (song.isPlaying()) {
      song.stop();
    }
    // load a new song:
    song = loadSound('data/'+ songs[currentSong], resumePlay);
    return true;
  } else {        // if the song number was out of range, return false
    return false;
  }
}

function resumePlay() {
  // if the song isn't playing, play it
  if (song.isPlaying()){
    song.stop();
  } else {
    song.play();
  }
}

function keyReleased() {
  controlSound(keyCode);    // send the ASCII number of the key
}

