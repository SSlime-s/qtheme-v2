/*
Copyright (c) 2019 Segun Adebayo
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
// @see https://github.com/chakra-ui/chakra-ui/blob/fd231f720965b505faf5a0d8153366f8989ec9ce/packages/hooks/src/use-merge-refs.ts

/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'

type ReactRef<T> = React.Ref<T> | React.MutableRefObject<T>

export function assignRef<T = unknown>(ref: ReactRef<T> | undefined, value: T) {
  if (ref == null) return

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current = value
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`)
  }
}

/**
 * React hook that merges react refs into a single memoized function
 *
 * @example
 * import React from "react";
 * import { useMergeRefs } from `@chakra-ui/hooks`;
 *
 * const Component = React.forwardRef((props, ref) => {
 *   const internalRef = React.useRef();
 *   return <div {...props} ref={useMergeRefs(internalRef, ref)} />;
 * });
 */
export function useMergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return React.useMemo(() => {
    if (refs.every(ref => ref == null)) {
      return null
    }
    return (node: T) => {
      refs.forEach(ref => {
        if (ref) assignRef(ref, node)
      })
    }
  }, refs)
}
