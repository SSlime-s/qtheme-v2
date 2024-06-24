/*
Copyright (c) 2019 東京工業大学デジタル創作同好会traP
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
// ref: https://github.com/traPtitech/traQ_S-UI/blob/master/src/lib/theme/resolve/util.ts

import type { CSSColorType, CSSColorTypeSimple } from '@/index'

export interface OnlyDefault<T> {
  default: T
}

export const resolveOnlyDefault = (
  original: CSSColorTypeSimple
): OnlyDefault<CSSColorType> => ({ default: original })

export const resolveWithFallback = <
  T extends { fallback: CSSColorTypeSimple },
  S,
>(
  original: T | CSSColorTypeSimple,
  f: (originalObj: T | undefined, fallback: string) => S
) => {
  if (typeof original === 'string') {
    return f(undefined, original)
  }
  return f(original, original.fallback)
}
