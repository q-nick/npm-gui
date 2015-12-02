var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');

//Lets define a port we want to listen to
const PORT = 1337;
const HOST = '0.0.0.0';

app.get('/add/:module', function(req, res) {
    var output = '';
    child = exec('npm install --save ' + req.params.module,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

app.get('/install', function(req, res) {
    var output = '';
    var child = exec('npm install',
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

app.get('/tasks', function(req, res) {
    fs.readFile('./package.json', 'utf-8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var packageJSON = JSON.parse(data);

        res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJSON.scripts, null, 2) + '</textarea>');
    });
});

app.use(express.static('public', {'index': ['index.html', 'index.htm']}));
app.use('/node_modules', express.static('node_modules'));

app.listen(PORT, HOST, function() {
    console.log('Server running at http://' + HOST + ':' + PORT + '/');
});
