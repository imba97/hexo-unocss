export function once<T extends (...args: any[]) => any>(fn: T): T {
  let didCall = false
  let result: ReturnType<T>

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    if (!didCall) {
      didCall = true
      result = fn.apply(this, args)
    }
    return result
  } as T
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
