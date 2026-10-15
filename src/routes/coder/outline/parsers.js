import { parser as pythonParser } from "@lezer/python";
import { parser as jsParser } from "@lezer/javascript";
import { parser as mdParser } from "@lezer/markdown";


export function parsePython(content, index=1) {
    let subnodes = [];
    // parse Python
    let node = pythonParser.parse(content)
    // iterate through subnodes
    node.iterate({
        enter: subnode => {
            // for function and class defs...
            if (["FunctionDefinition", "ClassDefinition"].includes(subnode.type.name)) {
                // get name and content
                let namenode = subnode.node.getChild("VariableName")
                let bodynode = subnode.node.getChild("Body")
                // append details
                subnodes.push({
                    content: content.slice(bodynode.from, bodynode.to),
                    index: index + subnode.from,
                    type: subnode.type.name,
                    name: content.slice(namenode.from, namenode.to),
                })
                // stop iteration
                return false
            }
        }
    })

    return subnodes
}


export function parseJavaScript(content, index=1) {
    let subnodes = [];
    // parse JavaScript
    let node = jsParser.parse(content)
    // iterate through subnodes
    node.iterate({
        enter: subnode => {
            // for function and class defs...
            if (["FunctionDeclaration", "ClassDeclaration"].includes(subnode.type.name)) {
                // get name and content
                let namenode = subnode.node.getChild("VariableDefinition")
                let bodynode = subnode.node.getChild("Block")
                // append details
                subnodes.push({
                    content: content.slice(bodynode.from, bodynode.to),
                    index: index + subnode.from,
                    type: subnode.type.name,
                    name: content.slice(namenode.from, namenode.to),
                })
                // stop iteration
                return false
            }
            // for variable defs...
            if (subnode.type.name === "VariableDeclaration") {
                // get name
                let namenode = subnode.node.getChild("VariableDefinition") || subnode.node.getChild("ObjectPattern")
                let bodynode = subnode.node.getChild("Equals")

                // append details
                subnodes.push({
                    content: bodynode ? content.slice(bodynode.from, bodynode.to) : "undefined",
                    index: 1 + index + subnode.from,
                    type: subnode.type.name,
                    name: content.slice(namenode.from, namenode.to),
                })
                // stop iteration
                return false
                
            }
        }
    })

    return subnodes
}


export function parseMarkdown(content, index=1) {
    let subnodes = [];
    // parse Markdown
    let node = mdParser.parse(content)
    // 
    let skipTo = undefined
    // iterate through subnodes
    node.iterate({
        enter: subnode => {
            // are we skipping to a given node?
            if (skipTo && subnode.to < skipTo.to) {
                return false
            }
            // get coords of this node
            let i = [subnode.from, subnode.to]
            // for headings...
            if ([
                "SetextHeading1", "ATXHeading1",
                "SetextHeading2", "ATXHeading2", 
                "ATXHeading3",
                "ATXHeading4", 
                "ATXHeading5", 
                "ATXHeading6"
            ].includes(subnode.type.name)) {
                // strip the header mark
                for (let mark of subnode.node.getChildren("HeaderMark")) {
                    if (subnode.type.name.startsWith("Setext")) {
                        i[1] = mark.from
                    } else {
                        i[0] = mark.to
                    }
                }
                // get heading level
                let level = parseInt(subnode.type.name.at(-1))
                // get extent of headed content
                let next = subnode.node.nextSibling
                while (
                    next 
                    && next.nextSibling
                    && !(
                        next.type.name.match(/Heading\d$/) && parseInt(next.type.name.at(-1)) <= level
                    )
                ) {
                    next = next.nextSibling
                }
                // append details
                subnodes.push({
                    content: content.slice(subnode.to, next.node.from),
                    index: index + subnode.to,
                    type: subnode.type.name,
                    name: content.slice(...i),
                })
                // skip to end of next heading (inner content is already handled)
                skipTo = next
                // stop iteration
                return false
            }
        }
    })

    return subnodes
}
