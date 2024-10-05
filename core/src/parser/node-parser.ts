import { Node } from '../model/node';
import { Estimation } from '../model/estimation';
import { parseError } from '../util/errors';
import { parseEstimation } from './estimation-parser';

const NODE_ADDITIONS_PATTERN = /([@#&])([^@#&]+)/g;
const INDENT_PATTERN = /^(\s*)([^@#&%]+?)(?:\s+([@#&%].*?))?\s*$/;

export function parseNode(line: string): Node {
    const nodeMatch = INDENT_PATTERN.exec(line);
    /* c8 ignore next 3 */
    if (!nodeMatch) {
        throw parseError('Invalid node format: ' + line);
    }

    const indentStr = nodeMatch[1];
    const indent = indentStr.length;
    const title = nodeMatch[2];
    const additionString = nodeMatch[3];
    const assignees: string[] = [];
    const tags: string[] = [];
    let estimation: Estimation | undefined = undefined;

    let match;
    while ((match = NODE_ADDITIONS_PATTERN.exec(additionString))) {
        const type = match[1];
        const value = match[2].trim();
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
        }
    }
    return new Node(indent, title, assignees, tags, estimation);
}
