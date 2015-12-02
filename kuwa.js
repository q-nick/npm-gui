var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');

//Lets define a port we want to listen to
const PORT = 1337;
const HOST = '0.0.0.0';

app.get('/modules/add/:name', function(req, res) {
    var output = '';
    var child = exec('npm install --save ' + req.params.name,
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

app.get('/modules/remove/:name', function(req, res) {
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


app.get('/modules', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.dependencies, null, 2) + '</textarea>');
});
app.get('/modules/dev', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.devDependencies, null, 2) + '</textarea>');
});

app.get('/tasks', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.get('/tasks/add/:name', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    packageJson.scripts[req.params.name] = 'node';
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.get('/tasks/remove/:name', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    delete packageJson.scripts[req.params.name];
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.get('/tasks/run/:name', function(req, res) {
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
