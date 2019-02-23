const fs = require('fs');
const path = require('path');

module.exports =  file  => fs.readFileSync(path.resolve(__dirname, './../../examples/' + file ), 'utf8')