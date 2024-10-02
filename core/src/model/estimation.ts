import { EstimationUnit } from './estimation-unit';

export class Estimation {
    constructor(
        readonly unit: EstimationUnit,
        readonly value: number
    ) {}
}
