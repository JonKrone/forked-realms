import { CamelCase, CamelCaseKeys } from '@/lib/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const camelizeKeys = <T extends Record<string, any>>(obj: T) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = snakeToCamel(key) as CamelCase<typeof key>
    ;(acc as Record<string, unknown>)[camelKey] = value
    return acc
  }, {} as CamelCaseKeys<T>)
}

const snakeToCamel = (str: string) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}
