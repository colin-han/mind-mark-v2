import { parseDirective } from './directive-parser';
import { parseError } from '../util/errors';

describe('parseDirective', () => {
    it('should throw an error for an invalid directive', () => {
        const line = '  @unknown directive';
        expect(() => parseDirective(line)).toThrow(
            parseError('Unknown directive type: unknown')
        );
    });

    it('should throw an error for an invalid directive format', () => {
        const line = 'invalid directive';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid directive: invalid directive')
        );
    });
});
