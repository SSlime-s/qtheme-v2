import { useMemo } from 'react'

export interface IWrapper {
  children: string
  Wrapper?:
    | React.FC<{
        children: string
      }>
    | React.FC<IWrapper>[]
}

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
