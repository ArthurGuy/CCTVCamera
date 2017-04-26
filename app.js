
var version = '1.19';


var args = process.argv.slice(2);

var httpServer = 'https://bbms.buildbrighton.com/camera/store';
var socketServer = 'http://192.168.10.100:3000/';

if (typeof args[0] != 'undefined') {		
    httpServer = 'http://' + args[1];		
}

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var childProcess;

var path = require('path');

var fs = require('fs');

var FormData = require('form-data');
var request = require('request');

var os = require('os');
var ifaces = os.networkInterfaces();


var imagePath = '/';
var imageName = 'output.jpg';

var ipAddress = null;

var updateInProgress = false;


var heartbeatIntervalID = setInterval(takeImage, 30000);

function getAbsoluteImagePath() {
    return path.join(__dirname, imagePath, imageName);
}

function sendImage(code) {
    
    //console.log("Photo capture complete, status code:" + code);
    
    // A success should come back with exit code 0
    if (code !== 0) {
        
        return;
    }
    
    fs.readFile(getAbsoluteImagePath(), function(err, buffer){
        if (typeof buffer == 'undefined') {
            
            return;
        }
    });
    
    var fileName = guid() + '.jpg';
    
    // Post the image data via an http request
    var form = new FormData();
    form.append('takeId', takeId);
    form.append('startTime', lastReceiveTime);
    form.append('cameraName', cameraName);
    form.append('fileName', fileName);
    form.append('image', fs.createReadStream(getAbsoluteImagePath()));

    form.submit(httpServer, function(err, res) {
        if (err) {
            console.log("Image upload error");
        } else {
            console.log("Image uploaded");
        }
        
        fs.unlink(getAbsoluteImagePath(), function () {
            // file deleted
        });
        
        res.resume();
    });
}

function takeImage() {
    var args = [
        //'-w', 2592,   // width
        //'-h', 1944,  // height
        //'-t', 100,  // how long should taking the picture take?
        //'-q', 30,     // quality
        '-awb', 'fluorescent', 
        '-o', getAbsoluteImagePath()   // path + name
    ];
    var imageProcess = spawn('raspistill', args);
    imageProcess.on('exit', sendImage);
}

function updateSoftware() {
    childProcess = exec('cd ' + __dirname + '; git pull; npm install', function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        process.exit();
    });
}
  
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}