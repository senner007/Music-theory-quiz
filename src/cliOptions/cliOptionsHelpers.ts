export const QUIZ_TYPE_ARG = "qt";
export const ARG_PREFIX = "--";
export const HELP_ARG = "what";

export const line = "-------------------------------------------";

export function checkArrayOrder(arr1: string[], arr2: string[]): boolean {
  const a = arr1.filter((a) => arr2.includes(a));
  const b = arr2.filter((b) => arr1.includes(b));

  return JSON.stringify(a) === JSON.stringify(b);
}

export function formatProcessArgs(ars: string) {
  // remove ^
  return ars.replace(/\^/g, "");
}

export function everyElementIn(arr1: any[], arr2: any[]) {
  return arr1.every((r) => arr2.includes(r));
}

export function findArgsForOption(arg: string) {
  const argsTypeIndex = process.argv.findIndex((a, index) => a === arg);

  if (argsTypeIndex === -1) return undefined;

  const argsArray = [];
  for (let i = argsTypeIndex + 1; i < process.argv.length; i++) {
    if (process.argv[i].startsWith(ARG_PREFIX)) break;
    process.argv[i] = formatProcessArgs(process.argv[i]);
    argsArray.push(process.argv[i]);
  }
  return argsArray.length > 0 ? argsArray : undefined
}
