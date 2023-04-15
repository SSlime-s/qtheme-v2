type AssertIsArray = (value: unknown) => asserts value is unknown[]
export const assertIsArray: AssertIsArray = value => {
  if (!Array.isArray(value)) {
    throw new Error('Expected array')
  }
}

type AssertIsObject = (
  value: unknown
) => asserts value is Record<string, unknown>
export const assertIsObject: AssertIsObject = value => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Expected object')
  }
}

type AssertIsArrayObject = (
  value: unknown
) => asserts value is Record<string, unknown>[]
export const assertIsArrayObject: AssertIsArrayObject = value => {
  assertIsArray(value)
  value.forEach(row => {
    assertIsObject(row)
  })
}

export interface Tree<T> extends ReadonlyTree<T> {
  value: T
  children?: Tree<T>[]
}
export interface ReadonlyTree<T> {
  readonly value: T
  readonly children?: readonly ReadonlyTree<T>[]
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}
