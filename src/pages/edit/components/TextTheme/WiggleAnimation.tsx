const WiggleKeyframeObject = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(8px)' },
  { transform: 'translateX(-8px)' },
  { transform: 'translateX(4px)' },
  { transform: 'translateX(0)' },
] satisfies Keyframe[]
const WiggleOptions = {
  duration: 300,
  easing: 'ease-out',
} as const satisfies KeyframeAnimationOptions

export const wiggleElement = (
  element: HTMLElement,
  options?: KeyframeAnimationOptions
) => {
  element.animate(WiggleKeyframeObject, options ?? WiggleOptions)
}
