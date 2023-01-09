import { NextApiRequest } from "next"

export const extractUserName = (req: NextApiRequest) => {
  const userId = req.headers['x-showcase-user'] as string | undefined
  return userId
}
