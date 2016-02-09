var express = require('express');
var router = express.Router();

router.use(express.static(__dirname + '/../../public', {'index': ['index.html', 'index.htm']}));
router.use('/node_modules', express.static('node_modules'));
console.log(__dirname + '/../../public');
module.exports = router;