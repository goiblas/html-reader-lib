
// sanitanize
var ATTRIBUTE_MAPPING = {
    'for': 'htmlFor',
    'class': 'className'
};

function sanitanizeAttribute(attr) {
    return ATTRIBUTE_MAPPING[attr] ? ATTRIBUTE_MAPPING[attr]: attr;
}

const arrayAttributesToObject = attributes => {
    if(attributes.length > 0) {
        const result = {};
        attributes.forEach(({key, value}) => {
            const attr = sanitanizeAttribute(key);
            result[attr] = value || attr;
        });
        return result;
    } else {
        return {};
    }
}

export const sanitizeNode = node => {
    if(node.hasOwnProperty('content')) {
        node.content = node.content.trim()
    }
    if(node.hasOwnProperty('attributes')) {
        node.attributes = arrayAttributesToObject(node.attributes);
    }
    if(node.hasOwnProperty('children')) {
        node.children = node.children.map( child => sanitizeNode(child))
    }
    return node;
}



// comments utils
const commentReader = comment => {
    const [tagName, attributesString] = comment.replace('::', '').trim().split(/ (.+)/);
    const attributesArray = attributesString.replace(/{|}| /g,'').split(',').map( attr => {
        const properties = attr.split(':');
        return {[properties[0]]: properties[1]};
    });
    
    const attributes = {};
    attributesArray.forEach(attr => {
        Object.assign(attributes, attr);
    });

    return {
        tagName, attributes
    }
}

const applyCommentToElement = ({tagName, attributes}, node) => {
    return { ...node, tagName,  attributes: {...attributes, ...node.attributes} };
}

const includeChildrenToAttributes = (children, attributes) => {
    const value = children.map( child => {

        const readChildren = innerChild => {
            if(innerChild.type === 'text') {
                return innerChild.content || '';
            }
            if(innerChild.type === 'element') {
                const { tagName, children } = innerChild;
                return `<${tagName}>${children.map( c => readChildren(c))}</${tagName}>`
            }
        }
        return readChildren(child)
    }).join();
    return {...attributes, value };
}

let commentStore = null;
export const applyComments = obj => {

    const readNode = node => {
        if( !node.hasOwnProperty('type')) {
            return;
        }
        if(node.type === 'comment') {
            commentStore = commentReader(node.content);
            return;
        }

        if(node.type === 'element' && commentStore) {
            node = applyCommentToElement(commentStore, node);
            if(node.hasOwnProperty('children') && node.children.length > 0 ){
                node.attributes = includeChildrenToAttributes(node.children, node.attributes);
                node.children = [];
            }
            commentStore = null;
        }
        if(node.hasOwnProperty('children')) {
            node.children = node.children.map( child => readNode(child))
        }
        return node;
    }

    return readNode(obj);
}
