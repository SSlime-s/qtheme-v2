/**
 * 標準入力から csv を読み込んで、migration する
 *
 * 手順
 *
 * 0. (データベースを有効にする)
 * 1. package.json に "type": "module" を追加する
 * 2. pnpm i する
 * 3. src/model/theme.ts の import の拡張子に .js を追加する
 * 4. 古いデータベースから csv を出力する
 * 5. それをどこかに保存して pnpm run migration < <file> する
 * 5. 3 を元に戻す & 5 で作ったファイルを削除する
 * 6. 完了
 */

import { connectDb } from '../src/model/db.js'
import { ulid } from 'ulid'
import { Connection } from 'mysql2/promise'
import { bumpVersion } from '../src/apollo/resolvers/utils/bumpVersion.js'
import { basicThemeSchema, Theme } from '../src/model/theme.js'
import { isDarkColor } from '../src/model/color.js'

const migration = ({
  title,
  theme: old_theme,
  author,
  created_at,
}: {
  title: string
  theme: string
  author: string
  created_at: string
}) => {
  const created_at_date = new Date(created_at)
  const id = ulid(created_at_date.getTime())
  const id_for_version = ulid(created_at_date.getTime())
  const version = bumpVersion()
  const description = `Migrated from QTheme (qtheme.trap.games)`
  const visibility = 'private'
  let theme: Theme
  try {
    const old_theme_parsed = JSON.parse(old_theme)
    basicThemeSchema.parse(old_theme_parsed)
    theme = {
      version: 2,
      basic: old_theme_parsed as Theme['basic'],
    }
  } catch (e) {
    console.error('failed to parse theme', title, 'by', author, e)
    return
  }

  let isDark: boolean
  try {
    const bgPrimary =
      typeof theme.basic.background.primary === 'string'
        ? theme.basic.background.primary
        : theme.basic.background.primary.fallback
    isDark = isDarkColor(bgPrimary)
  } catch (e) {
    console.error(e)
    isDark = false
  }
  const type = isDark ? 'dark' : 'light'

  return {
    theme: {
      id,
      title,
      description,
      author_user_id: author,
      visibility,
      type,
      theme,
      created_at: created_at_date,
    },
    version: {
      id: id_for_version,
      theme_id: id,
      version,
      theme,
      created_at: created_at_date,
    },
  }
}

const bulk_migration = async (
  themes: readonly {
    title: string
    theme: string
    author: string
    created_at: string
  }[]
) => {
  let connection: Connection | undefined
  try {
    connection = await connectDb()
    await connection.beginTransaction()
    const migrated_themes = themes
      .map(theme => migration(theme))
      .filter(<T>(x: T | undefined): x is T => x !== undefined)
    const theme_count = migrated_themes.length
    {
      const sql = `
        INSERT INTO themes (
          id,
          title,
          description,
          author_user_id,
          visibility,
          type,
          theme,
          created_at
        ) VALUES
          ${Array.from(
            { length: theme_count },
            () => '(?, ?, ?, ?, ?, ?, ?, ?)'
          ).join(', ')}
      `
      const values = migrated_themes.flatMap(({ theme }) => [
        theme.id,
        theme.title,
        theme.description,
        theme.author_user_id,
        theme.visibility,
        theme.type,
        JSON.stringify(theme.theme),
        theme.created_at,
      ])
      await connection.execute(sql, values)
    }
    {
      const sql = `
        INSERT INTO theme_versions (
          id,
          theme_id,
          version,
          theme,
          created_at
        ) VALUES
          ${Array.from({ length: theme_count }, () => '(?, ?, ?, ?, ?)').join(
            ', '
          )}
      `
      const values = migrated_themes.flatMap(({ version }) => [
        version.id,
        version.theme_id,
        version.version,
        JSON.stringify(version.theme),
        version.created_at,
      ])
      await connection.execute(sql, values)
    }
    await connection.commit()
  } catch (e) {
    console.error(e)
    await connection?.rollback()
  } finally {
    await connection?.end()
  }
}

import { createInterface } from 'readline'
import * as dotenv from 'dotenv'
import { parse } from 'csv-parse/sync'
const main = () => {
  dotenv.config()
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  const lines: string[] = []
  const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  reader.on('line', (line: string) => {
    lines.push(line)
  })
  reader.on('close', async () => {
    if (
      lines[0] !==
      '"id","title","name","json","version","is_publish","created_at","favorite_num"'
    ) {
      console.error('Invalid CSV')
      return
    }

    const themes = lines.slice(1).map(line => {
      // const [, title, author, theme, , , created_at] = line.split('","')
      //   .map(x => x.replace(/^"|"$/g, ''))
      //   .map(x => x.replace(/""/g, '"'))
      const [, title, author, theme, , , created_at] = parse(line, {
        columns: false,
        skip_empty_lines: true,
      })[0]

      return {
        title,
        theme,
        author,
        created_at,
      }
    })
    await bulk_migration(themes)
  })
}

main()
