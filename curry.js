/**
 * Generic curry utility. Works with fixed-arity functions.
 * curry((a,b,c) => ...) returns a function taking one arg at a time: f(a)(b)(c)
 * Also supports supplying multiple args at once: f(a,b)(c) etc.
 */
export function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args.slice(0, arity))
    }
    return (...next) => curried.apply(this, args.concat(next))
  }
}

/**
 * A helper to show remaining arity for UI/teaching.
 */
export function remainingArity(fn) {
  return Math.max(0, fn.length || 0)
}

// Sample functions to curry
export const add3 = (a,b,c) => a + b + c;
export const multiply3 = (a,b,c) => a * b * c;

// A slightly more advanced example: build a curried logger
export const log = (prefix, level, message) => {
  const levels = { info: 'ℹ️', warn: '⚠️', error: '❌' }
  return `${levels[level] ?? ''} ${prefix}: ${message}`
}
