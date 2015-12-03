var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');
var bodyParser = require('body-parser');

//Lets define a port we want to listen to
const PORT = 1337;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.put('/modules', function(req, res) {
    var output = '';
    var child = exec('npm install --save ' + req.body.name,
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

app.delete('/modules/:name', function(req, res) {
    var output = '';
    var child = exec('npm uninstall --save ' + req.params.name,
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

app.get('/modules/install', function(req, res) {
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


app.get('/modules', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfModules = [];
    buildArrayFromObject(packageJson.dependencies, arrayOfModules, 'name', 'version');
    res.status(200).send(JSON.stringify(arrayOfModules, null, 2));
});
app.get('/modules/dev', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfDevModules = [];
    buildArrayFromObject(packageJson.devDependencies, arrayOfDevModules, 'name', 'version');

    res.status(200).send(JSON.stringify(arrayOfDevModules, null, 2));
});

app.get('/tasks', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfTasks = [];
    buildArrayFromObject(packageJson.scripts, arrayOfTasks, 'name', 'command');

    res.status(200).send(JSON.stringify(arrayOfTasks, null, 2));
});

app.put('/tasks', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    packageJson.scripts[req.body.name] = req.body.command;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.delete('/tasks/:name', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    delete packageJson.scripts[req.params.name];
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.post('/tasks/:name', function(req, res) {
    var output = '';
    var child = exec('npm run ' + req.params.name,
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

app.use(express.static('public', {'index': ['index.html', 'index.htm']}));
app.use('/node_modules', express.static('node_modules'));

app.listen(PORT, HOST, function() {
    console.log('Kufa panel running at http://' + HOST + ':' + PORT + '/');
    console.log('\n\nI will be waiting here to help you with your work with pleasure.');
});


function buildArrayFromObject(sourceObject, destinationArray, keyName, valueName) {
    for (var key in sourceObject) {
        if (sourceObject.hasOwnProperty(key)) {
            var obj = {};
            obj[keyName] = key;
            obj[valueName] = sourceObject[key];
            destinationArray.push(obj);
        }
    }
}