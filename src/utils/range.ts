/**
 * Returns an array of numbers from 0 to n - 1
 * @param max
 * @returns
 * @example range(3) // [0, 1, 2]
 */
export function range(max: number): number[] {
  const array = [];
  for (let i = 0; i < max; i++) {
    array.push(i);
  }
  return array;
}
