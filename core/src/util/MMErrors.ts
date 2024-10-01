export class TypeError extends Error {
  constructor() {
    super("Type is not match!");
  }
}

const _typeError = new TypeError();
export function typeError() { return _typeError; }

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function parseError(message: string) {
  return new ParseError(message);
}

export class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function runtimeError(message: string) {
  return new RuntimeError(message);
}

export class IllegalArgumentError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function illegalArgumentError(message: string) {
  return new IllegalArgumentError(message);
}