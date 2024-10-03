import { parseNode } from './node-parser';
import { Node } from '../model/node';
import { Estimation } from '../model/estimation';
import { parseError } from '../util/errors';
import { EstimationUnits } from '../model/estimation-unit';

describe('parseNode', () => {
    it('should parse a node with title only', () => {
        const line = '  Title';
        const result = parseNode(line);
        expect(result).toEqual(new Node(2, 'Title', [], [], undefined));
    });

    it('should parse a node with assignees', () => {
        const line = '  Title @assignee1 @assignee2';
        const result = parseNode(line);
        expect(result).toEqual(
            new Node(2, 'Title', ['assignee1', 'assignee2'], [], undefined)
        );
    });

    it('should parse a node with tags', () => {
        const line = '  Title #tag1 #tag2';
        const result = parseNode(line);
        expect(result).toEqual(
            new Node(2, 'Title', [], ['tag1', 'tag2'], undefined)
        );
    });

    it('should parse a node with estimation', () => {
        const line = '  Title &5h';
        const estimation = new Estimation(EstimationUnits.HOUR, 5); // Assuming Estimation constructor takes a string
        const result = parseNode(line);
        expect(result).toEqual(new Node(2, 'Title', [], [], estimation));
    });

    it('should parse a node with assignees, tags, and estimation', () => {
        const line = '  Title @assignee1 #tag1 &5h';
        const estimation = new Estimation(EstimationUnits.HOUR, 5); // Assuming Estimation constructor takes a string
        const result = parseNode(line);
        expect(result).toEqual(
            new Node(2, 'Title', ['assignee1'], ['tag1'], estimation)
        );
    });

    it('should throw an error for duplicate estimation', () => {
        const line = '  Title &5h &3h';
        expect(() => parseNode(line)).toThrow(
            parseError('Duplicate estimation')
        );
    });
});
