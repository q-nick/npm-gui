'use strict';

var WebSocketServer = require('ws').Server;

var consoleSocket = null;

function send(msg) {
    if (consoleSocket) {
        consoleSocket.send(msg);
    }
}

function bind(server) {
    var wss = new WebSocketServer({
        server: server
    });

    wss.on('connection', function connection(ws) {
        consoleSocket = ws;
        consoleSocket.send('console connected \n');
    });

    wss.on('message', function connection(a, b, c) {
        console.log(a, b, c);
    });
}

module.exports.send = send;
module.exports.bind = bind;
