import path from 'path'

export interface ChannelPath {
  name: string
  href: string
}
export const convertChannelPath = (names: readonly string[]): ChannelPath[] => {
  const channelPaths: ChannelPath[] = []
  let href = '/'
  for (const name of names) {
    href = path.join(href, name)
    channelPaths.push({ name, href })
  }
  return channelPaths
}
export const extendChannelPath = (
  base: readonly ChannelPath[],
  names: readonly string[]
): ChannelPath[] => {
  if (base.length === 0) return convertChannelPath(names)
  const channelPaths: ChannelPath[] = [...base]
  let href = channelPaths[channelPaths.length - 1].href
  for (const name of names) {
    href = path.join(href, name)
    channelPaths.push({ name, href })
  }
  return channelPaths
}
