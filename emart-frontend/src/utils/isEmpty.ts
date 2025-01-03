export default function isEmpty<T>(
  value: T,
): value is T extends null | undefined ? T : never {
  return value === null || typeof value === 'undefined';
}
