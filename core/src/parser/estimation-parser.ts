import { Estimation } from '../model/estimation';
import { EstimationUnits } from '../model/estimation-unit';
import { parseError } from '../util/errors';

const ESTIMATION_PATTERN = /(\d+(?:\.\d+)?)\s*(h|d|w|hours?|days?|weeks?)/i;

export function parseEstimation(line: string): Estimation | undefined {
    const match = ESTIMATION_PATTERN.exec(line);
    if (!match) throw parseError(`Invalid estimation: ${line}`);

    const value = parseFloat(match[1]);
    const unit = EstimationUnits.parse(match[2].toLowerCase());
    if (!unit) throw parseError(`Invalid estimation unit: ${match[2]}`);

    return new Estimation(unit, value);
}
