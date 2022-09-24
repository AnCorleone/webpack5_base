export function count(...args) {
  return args.reduce((prev, cur) => { return prev + cur }, 0)
}
