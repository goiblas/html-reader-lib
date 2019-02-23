// import { isEqual } from 'lodash';
// dependencias externas
const { parse } = require('himalaya');

// dependencias internas
const { htmlTrim } = require('./utils/html-utils');

// dependencias de desarrollo
const log = require('./dev/object-log');
const example = require('./dev/examples-reader')('01-simple.html');




const htmlTrimed = htmlTrim(example);
const html = parse( htmlTrimed);


const { content:commment } = html[2];
const [tagName, attributesString] = commment.replace('::', '').trim().split(/ (.+)/);
  
  const attributes = attributesString.replace(/{|}| /g,'').split(',').map( attr => {
      const properties = attr.split(':');
      return {[properties[0]]: properties[1]};
  });

  log(html);