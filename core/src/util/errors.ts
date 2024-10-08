/* c8 ignore start */
export class TypeError extends Error {
    constructor() {
        super('Type does not match!');
    }
}

const _typeError = new TypeError();
export function typeError() {
    return _typeError;
}

export class ParseError extends Error {}

export function parseError(message: string) {
    return new ParseError(message);
}

export class RuntimeError extends Error {}

export function runtimeError(message: string) {
    return new RuntimeError(message);
}

export class IllegalArgumentError extends Error {}

export function illegalArgumentError(message: string) {
    return new IllegalArgumentError(message);
}
