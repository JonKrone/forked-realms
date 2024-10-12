import { CamelCase } from '@/lib/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CamelCaseKeys<T extends Record<string, any>> = {
  // for each key in T, if the key is a string, convert it to camelCase
  [K in keyof T as CamelCase<K & string>]: T[K]
}

export const camelizeKeys = <T extends Record<string, any>>(
  obj: T
): CamelCaseKeys<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = snakeToCamel(key) as CamelCase<typeof key>
    ;(acc as Record<string, unknown>)[camelKey] = value
    return acc
  }, {} as CamelCaseKeys<T>)
}

const snakeToCamel = (str: string) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}
