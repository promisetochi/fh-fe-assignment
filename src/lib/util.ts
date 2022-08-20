export const conscriptToRange = (n: number, max: number, min: number) => {
  return Math.max(Math.min(n, max), min)
}
