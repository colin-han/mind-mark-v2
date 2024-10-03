import { EstimationUnits } from './estimation-unit';

describe('EstimationUnits', () => {
    it('should be able to parse estimation unit', () => {
        expect(EstimationUnits.parse('h')).toBe(EstimationUnits.HOUR);
        expect(EstimationUnits.parse('d')).toBe(EstimationUnits.DAY);
        expect(EstimationUnits.parse('days')).toBe(EstimationUnits.DAY);
        expect(EstimationUnits.parse('w')).toBe(EstimationUnits.WEEK);
    });

    it('should be able to calc to hours', () => {
        expect(EstimationUnits.HOUR.toHours(1)).toBe(1);
        expect(EstimationUnits.DAY.toHours(1)).toBe(8);
        expect(EstimationUnits.WEEK.toHours(1)).toBe(8 * 5);
        expect(EstimationUnits.WEEK.toHours(2)).toBe(8 * 5 * 2);
    });
});
