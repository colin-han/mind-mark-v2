import { Node } from '../model/node';
import { Estimation } from '../model/estimation';
import { parseError } from '../util/errors';
import { parseEstimation } from './estimation-parser';

const NODE_ADDITIONS_PATTERN = /([@#&])([^@#&]+)/g;
const INDENT_PATTERN = /^(\s*)([^@#&]+)/;

export function parseNode(line: string): Node {
    const nodeMatch = INDENT_PATTERN.exec(line);
    if (!nodeMatch) {
        throw parseError('Invalid node format: ' + line);
    }

    const indentStr = nodeMatch[1];
    const indent = indentStr.length;
    const title = nodeMatch[2];
    const additionString = line.substring(nodeMatch[0].length);
    const assignees: string[] = [];
    const tags: string[] = [];
    let estimation: Estimation | undefined = undefined;

    let match;
    while ((match = NODE_ADDITIONS_PATTERN.exec(additionString))) {
        const type = match[1];
        const value = match[2];
        switch (type) {
            case '@':
                assignees.push(value);
                break;
            case '#':
                tags.push(value);
                break;
            case '&':
                if (estimation) throw parseError('Duplicate estimation');
                estimation = parseEstimation(value);
                break;
            default:
                throw parseError('Invalid node addition: ' + type);
        }
    }
    return new Node(indent, title, assignees, tags, estimation);
}
