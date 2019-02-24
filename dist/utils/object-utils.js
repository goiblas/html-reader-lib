import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
// sanitanize
var ATTRIBUTE_MAPPING = {
  'for': 'htmlFor',
  'class': 'className'
};

function sanitanizeAttribute(attr) {
  return ATTRIBUTE_MAPPING[attr] ? ATTRIBUTE_MAPPING[attr] : attr;
}

var arrayAttributesToObject = function arrayAttributesToObject(attributes) {
  if (attributes.length > 0) {
    var result = {};
    attributes.forEach(function (_ref) {
      var key = _ref.key,
          value = _ref.value;
      var attr = sanitanizeAttribute(key);
      result[attr] = value || attr;
    });
    return result;
  } else {
    return {};
  }
};

export var sanitizeNode = function sanitizeNode(node) {
  if (node.hasOwnProperty('content')) {
    node.content = node.content.trim();
  }

  if (node.hasOwnProperty('attributes')) {
    node.attributes = arrayAttributesToObject(node.attributes);
  }

  if (node.hasOwnProperty('children')) {
    node.children = node.children.map(function (child) {
      return sanitizeNode(child);
    });
  }

  return node;
}; // comments utils

var commentReader = function commentReader(comment) {
  var _comment$replace$trim = comment.replace('::', '').trim().split(/ (.+)/),
      _comment$replace$trim2 = _slicedToArray(_comment$replace$trim, 2),
      tagName = _comment$replace$trim2[0],
      attributesString = _comment$replace$trim2[1];

  var attributesArray = attributesString.replace(/{|}| /g, '').split(',').map(function (attr) {
    var properties = attr.split(':');
    return _defineProperty({}, properties[0], properties[1]);
  });
  var attributes = {};
  attributesArray.forEach(function (attr) {
    Object.assign(attributes, attr);
  });
  return {
    tagName: tagName,
    attributes: attributes
  };
};

var applyCommentToElement = function applyCommentToElement(_ref3, node) {
  var tagName = _ref3.tagName,
      attributes = _ref3.attributes;
  return _objectSpread({}, node, {
    tagName: tagName,
    attributes: _objectSpread({}, attributes, node.attributes)
  });
};

var includeChildrenToAttributes = function includeChildrenToAttributes(children, attributes) {
  var value = children.map(function (child) {
    var readChildren = function readChildren(innerChild) {
      if (innerChild.type === 'text') {
        return innerChild.content || '';
      }

      if (innerChild.type === 'element') {
        var tagName = innerChild.tagName,
            _children = innerChild.children;
        return "<".concat(tagName, ">").concat(_children.map(function (c) {
          return readChildren(c);
        }), "</").concat(tagName, ">");
      }
    };

    return readChildren(child);
  }).join();
  return _objectSpread({}, attributes, {
    value: value
  });
};

var commentStore = null;
export var applyComments = function applyComments(obj) {
  var readNode = function readNode(node) {
    if (!node.hasOwnProperty('type')) {
      return;
    }

    if (node.type === 'comment') {
      commentStore = commentReader(node.content);
      return;
    }

    if (node.type === 'element' && commentStore) {
      node = applyCommentToElement(commentStore, node);

      if (node.hasOwnProperty('children') && node.children.length > 0) {
        node.attributes = includeChildrenToAttributes(node.children, node.attributes);
        node.children = [];
      }

      commentStore = null;
    }

    if (node.hasOwnProperty('children')) {
      node.children = node.children.map(function (child) {
        return readNode(child);
      });
    }

    return node;
  };

  return readNode(obj);
};