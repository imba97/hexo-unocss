export function once<T extends Function>(this: unknown, fn: T): T {
  const _this = this
  let didCall = false
  let result: unknown

  return function () {
    if (didCall) {
      return result
    }

    didCall = true
    result = fn.apply(_this, arguments)

    return result
  } as unknown as T
}

export function get(obj: any, path: string, defaultValue: any = undefined) {
  const pathArray = Array.isArray(path) ? path : path.split('.')
  let current = obj

  for (const key of pathArray) {
    if (current === null || current === undefined) {
      return defaultValue
    }

    current = current[key]
  }

  return current === undefined ? defaultValue : current
}
