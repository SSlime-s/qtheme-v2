import { IncomingMessage } from 'http'

export const extractShowcaseUser = (req: IncomingMessage) => {
  const userId = req.headers['x-showcase-user'] as string | undefined
  return userId === '-' ? undefined : userId
}
