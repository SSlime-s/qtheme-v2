// import { createConnection, MysqlError } from 'mysql'
import { createConnection } from 'mysql2/promise'

export const connectDb = async () => {
  const url = process.env.DATABASE_URL
  if (url === undefined) throw new Error('DATABASE_URL is undefined')
  try {
    const connection = await createConnection(url)
    return connection
  } catch (error) {
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Unknown error')
    }
  }
}
