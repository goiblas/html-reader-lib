// import { isEqual } from 'lodash';
// dependencias externas
import { parse } from 'himalaya';

// dependencias internas
import { htmlTrim } from './utils/html-utils';

// dependencias de desarrollo
// const log = require('./dev/object-log');
// const example = require('./dev/examples-reader')('01-simple.html');




// const htmlTrimed = htmlTrim(example);
// const html = parse( htmlTrimed);


// const { content:commment } = html[2];
// const [tagName, attributesString] = commment.replace('::', '').trim().split(/ (.+)/);
  
//   const attributes = attributesString.replace(/{|}| /g,'').split(',').map( attr => {
//       const properties = attr.split(':');
//       return {[properties[0]]: properties[1]};
//   });

//   log(html);

const htmlTrimed = htmlTrim('<p>ho</p>');
const result = parse(htmlTrimed);
console.log(result);


export const exp = tag => console.log(tag);

