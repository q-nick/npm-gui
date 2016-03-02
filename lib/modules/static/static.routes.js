var express = require('express');
var router = express.Router();
var path = require('path');

router.use(express.static(path.normalize('./lib/public'), {'index': ['index.html', 'index.htm']}));
router.use('/node_modules', express.static('node_modules'));
module.exports = router;
