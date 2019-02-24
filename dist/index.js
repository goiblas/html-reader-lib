// dependencias externas
import { parse } from 'himalaya'; // dependencias internas

import { htmlTrim } from './utils/html-utils';
import { sanitizeNode, applyComments } from './utils/object-utils'; // dependencias de desarrollo
// const log = require('./dev/object-log');
// const example = require('./dev/examples-reader')('02-richtext.html');
// const htmlTrimed = htmlTrim(example);
// const htmlObject = parse(htmlTrimed)
//                         .map( node => sanitizeNode(node))
//                         .map( node => applyComments(node))
//                         // remove space of comments deleted
//                         .filter( element => element !== undefined);
// log(htmlObject);

export default {
  parseHtml: function parseHtml(html) {
    var htmlTrimed = htmlTrim(html);
    return parse(htmlTrimed).map(function (node) {
      return sanitizeNode(node);
    }).map(function (node) {
      return applyComments(node);
    }) // remove space of comments deleted
    .filter(function (element) {
      return element !== undefined;
    });
  }
};