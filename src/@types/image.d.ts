import { StaticImageData } from 'next/image'

declare module '*.png' {
  const value: StaticImageData
  export = value
}
