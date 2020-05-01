/**
 * Display a function.
 * Add the name given in argument to the function body
 */
// tslint:disable-next-line: ban-types
export function displayFunction(func: Function, name: string) {
  const stringFunc = func.toString();
  if (stringFunc.startsWith('function')) {
    return stringFunc.substring(0, 8) + ' ' + name + stringFunc.substring(9);
  } else {
    return ' ' + name + stringFunc;
  }
}
