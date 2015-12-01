var express = require('express');
var app = express();

//Lets define a port we want to listen to
const PORT=1337;
const HOST='127.0.0.1';

/*app.get('/', function (req, res) {
    res.send('Hello World')
});*/

app.use(express.static('public',{'index': ['index.html', 'index.htm']}));

app.listen(PORT, HOST,function(){
    console.log('Server running at http://'+HOST+':'+PORT+'/');
});
