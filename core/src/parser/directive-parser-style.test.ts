import { StyleDirective } from '../model/directive';
import { parseError } from '../util/errors';
import { parseDirective } from './directive-parser';

describe('parseDirective', () => {
    it('should parse a style directive correctly', () => {
        const line = '  @style #element color: red, font-size: 12px';
        const directive = parseDirective(line) as StyleDirective;
        expect(directive).toBeInstanceOf(StyleDirective);
        expect(directive.indent).toBe(2);
        expect(directive.selector).toBe('element');
        expect(directive.styles).toEqual({
            color: 'red',
            'font-size': '12px',
        });
    });

    it('should throw an error for an invalid style directive', () => {
        const line = '  @style #element invalid';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid style syntax: invalid')
        );
    });

    it('should has # for selector', () => {
        const line = '  @style element color: red';
        expect(() => parseDirective(line)).toThrow(
            parseError('Invalid style directive: element color: red')
        );
    });
});
