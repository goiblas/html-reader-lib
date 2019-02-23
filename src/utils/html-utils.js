const htmlTrim = html => {
    return html.replace(/\n/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
}

const applyFnTree = (tree, fn) => {
    
    const readTree = (node) => {
        fn(node)
        if(node.children) {
            node.children.map(readTree);
        }
        return node;
    }
    return readTree(tree);
}


module.exports = {
    htmlTrim,
    applyFnTree
}