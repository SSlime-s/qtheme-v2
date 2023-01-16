import { NextApiRequest } from 'next'

export const extractShowcaseUser = (req: NextApiRequest) => {
  const userId = req.headers['x-showcase-user'] as string | undefined
  return userId === '-' ? undefined : userId
}
