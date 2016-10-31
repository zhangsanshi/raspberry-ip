var ip = require('ip');
var child_process = require('child_process');
var path = require('path');
var exec = child_process.exec;
var fileQueue;

function getFilePath (source) {
    var sourcePath = path.join(__dirname, './source/' + source + '.mp3');
    return sourcePath;
}

function playAudio (loop) {
    var currentFileQueue = fileQueue.shift();
    fileQueue.push(currentFileQueue);
    exec('omxplayer ' + currentFileQueue, function (err) {
        if (!err) {
            if (++loop < fileQueue.length) {
                playAudio(loop);
            } else {
                play();
            }
        } else {
            console.log(err);
        }
    });
}

function play () {
    var address = ip.address();
    var loop = 0;
    fileQueue = [];
    if (address) {
        address = address.split('');
        fileQueue.push(getFilePath('start'));
        address.forEach(function (name, index) {
            if (name === '.') {
                name = 'point';
            }
            fileQueue.push(getFilePath(name));
        });
        fileQueue.push(getFilePath('end'));
        playAudio(loop);
    }
}

play();
