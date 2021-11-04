// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function typeOf(object: any): string {
  return Object.prototype.toString
    .call(object)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isObject(v: any): boolean {
  return typeOf(v) === 'object';
}
