import { IncludeDirective } from '../model/directive';
import { parseError } from '../util/errors';
import { parseDirective } from './directive-parser';

describe('parseDirective - include', () => {
    it('should parse an include directive correctly', () => {
        const line = '  @include file(alias)';
        const directive = parseDirective(line) as IncludeDirective;
        expect(directive).toBeInstanceOf(IncludeDirective);
        expect(directive.indent).toBe(2);
        expect(directive.ancestorNode).toBe('file');
        expect(directive.filter).toBe('alias');
    });

    it('should throw an error for an invalid include directive', () => {
        const line = '  @include invalid';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid include directive: invalid')
        );
    });
});
