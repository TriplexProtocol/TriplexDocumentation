import 'server-only'
import type { Dictionaries, Dictionary, Locale } from './i18n-config'

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries: Dictionaries = {
  en: () => import('./en'),
  'zh-SG': () => import('./zh-SG')
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  const { default: dictionary } = await (
    dictionaries[locale] || dictionaries.en
  )()

  return dictionary
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  // 所有支持的语言都是从左到右显示的
  return 'ltr'
}
