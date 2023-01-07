// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createConnection, MysqlError } from 'mysql'

interface Data {
  name: string
}

const connectDb = async () => {
  const url = process.env.DATABASE_URL
  if (url === undefined) throw new Error('DATABASE_URL is undefined')
  const connection = createConnection(url)
  connection.connect((err: MysqlError) => {
    if (err !== null) {
      throw new Error(`${err.message}: ${err.stack}`)
    }
  })
  return connection
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const connection = await connectDb()
  connection.query('SELECT * FROM `visibility_types`', (err, results) => {
    if (err !== null) {
      throw new Error(`${err.message}: ${err.stack}`)
    }
    console.log(results)
  res.status(200).json({ result: results })
  })
  connection.end()
}
