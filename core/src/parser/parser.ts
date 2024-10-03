import { Doc } from '../model/doc';
import { ParseError } from '../util/errors';
import { Node } from '../model/node';
import { parseDirective } from './directive-parser';
import { parseNode } from './node-parser';

const DIRECTIVE_MATCHER = /^\s*@.*$/;
const COMMENT_MATCHER = /^\s*#.*/;

function isDirective(line: string): boolean {
    return DIRECTIVE_MATCHER.test(line);
}

function isComments(line: string): boolean {
    return COMMENT_MATCHER.test(line);
}

export function parse(name: string, text: string): Doc {
    const doc = new Doc(name);
    const stack = [doc.root];
    let currentNode = doc.root;

    const lines = text.split(/[\r\n]+/);
    for (const line of lines) {
        if (isComments(line)) {
            continue;
        }

        if (isDirective(line)) {
            processForDirective(line, currentNode, doc.errors);
        } else {
            currentNode = processForNode(line, stack, currentNode, doc.errors);
        }
    }
    return doc;
}

function processForDirective(
    line: string,
    currentNode: Node,
    errors: ParseError[]
) {
    try {
        const instance = parseDirective(line);

        if (instance) {
            currentNode.directives.push(instance);
        }
    } catch (error) {
        errors.push(error as ParseError);
    }
}

function processForNode(
    line: string,
    stack: Node[],
    currentNode: Node,
    errors: ParseError[]
) {
    try {
        const node = parseNode(line);

        if (node.indent > currentNode.indent) {
            currentNode.children.push(node);
            node.parent = currentNode;
            stack.push(currentNode);
        } else {
            let parent = stack[stack.length - 1];
            while (parent.indent >= node.indent) {
                stack.pop();
                parent = stack[stack.length - 1];
            }
            parent.children.push(node);
            node.parent = parent;
        }
        return node;
    } catch (error) {
        errors.push(error as ParseError);
        return currentNode;
    }
}
