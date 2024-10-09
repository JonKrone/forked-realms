import { parseAsStringLiteral, useQueryState } from 'nuqs'

const pageOptions = ['welcome', 'description', 'username'] as const

export const useOnboardingParams = () => {
  return useQueryState(
    'page',
    parseAsStringLiteral(pageOptions).withDefault('welcome')
  )
}
