import { useMemo } from 'react'

export interface IWrapper {
  children: string
  Wrapper?:
    | React.FC<{
        children: string
      }>
    | React.FC<IWrapper>[]
}

/**
 * IWrapper を Props に取るような Wrapper を順に適用する
 * 複数の Wrapper が指定されているときは、最初の Wrapper に生の children が渡される
 *
 * ただし、ここで言う適用とは、文字列を適切に (これは Wrapper の実装による) 分割し、
 * 分割された文字列それぞれに (存在すれば) 次の Wrapper を適用したものを wrap もしくは 間に何かを挿入することを指す
 */
export const WrapResolver: React.FC<IWrapper> = ({ children, Wrapper }) => {
  const MainWrapper = useMemo(() => {
    if (Wrapper === undefined) {
      return undefined
    }
    if (Array.isArray(Wrapper)) {
      return Wrapper[0]
    }
    return Wrapper
  }, [Wrapper])

  const parsed = useMemo(() => {
    if (MainWrapper === undefined) {
      return children
    }
    if (Array.isArray(Wrapper)) {
      return <MainWrapper Wrapper={Wrapper.slice(1)}>{children}</MainWrapper>
    }
    return <MainWrapper>{children}</MainWrapper>
  }, [MainWrapper, Wrapper, children])

  return <>{parsed}</>
}
