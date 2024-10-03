import { parseEstimation } from './estimation-parser';
import { Estimation } from '../model/estimation';
import { EstimationUnits } from '../model/estimation-unit';
import { parseError } from '../util/errors';

describe('parseEstimation', () => {
    it('should parse valid estimations correctly', () => {
        const cases = [
            { input: '5h', expected: new Estimation(EstimationUnits.HOUR, 5) },
            {
                input: '2.5 hours',
                expected: new Estimation(EstimationUnits.HOUR, 2.5),
            },
            { input: '3d', expected: new Estimation(EstimationUnits.DAY, 3) },
            {
                input: '1.5 days',
                expected: new Estimation(EstimationUnits.DAY, 1.5),
            },
            { input: '1w', expected: new Estimation(EstimationUnits.WEEK, 1) },
            {
                input: '0.5 weeks',
                expected: new Estimation(EstimationUnits.WEEK, 0.5),
            },
        ];

        cases.forEach(({ input, expected }) => {
            expect(parseEstimation(input)).toEqual(expected);
        });
    });

    it('should throw an error for invalid estimations', () => {
        const cases = ['5', 'hours', '2.5 hr', '3 dayss', 'invalid'];

        cases.forEach((input) => {
            expect(() => parseEstimation(input)).toThrow(
                parseError(`Invalid estimation: ${input}`)
            );
        });
    });
});
