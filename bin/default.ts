/**
 * デフォルトのテーマを挿入するようのクエリを発行する
 */

import { ulid } from 'ulid'
import { darkTheme, lightTheme } from '../src/utils/theme/default.js'

const createdAt = new Date('2019-11-22T00:00:00.000Z')
const createdAt2 = new Date('2019-11-22T00:00:01.000Z')

const id = ulid(createdAt.getTime())
const id2 = ulid(createdAt2.getTime())

const idForVersion = ulid(createdAt.getTime())
const idForVersion2 = ulid(createdAt2.getTime())

const title = 'Default Light Theme'
const title2 = 'Default Dark Theme'

const description = 'traQ_S のデフォルトのライトテーマです。'
const description2 = 'traQ_S のデフォルトのダークテーマです。'

const author = 'traP'

const visibility = 'public'

const type = 'light'
const type2 = 'dark'

const sql_theme = `
INSERT INTO themes (id, title, description, author_user_id, visibility, type, theme, created_at)
VALUES ('${id}', '${title}', '${description}', '${author}', '${visibility}', '${type}', '${JSON.stringify(
  lightTheme
)}', '${createdAt.toISOString()}'),
        ('${id2}', '${title2}', '${description2}', '${author}', '${visibility}', '${type2}', '${JSON.stringify(
  darkTheme
)}', '${createdAt2.toISOString()}')
`

const sql_version = `
INSERT INTO theme_versions (id, theme_id, version, theme, created_at)
VALUES ('${idForVersion}', '${id}', 1, '${JSON.stringify(
  lightTheme
)}', '${createdAt.toISOString()}'),
       ('${idForVersion2}', '${id2}', 1, '${JSON.stringify(
  darkTheme
)}', '${createdAt2.toISOString()}')
`

console.log('sql_theme\n\n', sql_theme)
console.log('--------------------')
console.log('sql_version\n\n', sql_version)
