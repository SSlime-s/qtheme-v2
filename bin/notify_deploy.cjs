const { execSync } = require('child_process')

/**
 * @param {string} repositoryUrl
 */
module.exports = repositoryUrl => {
  const noOgpUrl = repositoryUrl.replace(/^https?:\/\//, '//')

  const tags = execSync('git tag --sort=v:refname', { encoding: 'utf8' })

  const [latestTag, previousTag] = tags.split('\n').filter(Boolean).reverse()

  const commits = execSync(
    `git log "${previousTag}".."${latestTag}" --pretty=format:"[\\\`%h\\\`](${noOgpUrl}/commit/%H): %s"`,
    { encoding: 'utf8' }
  ).trim()

  const body = `### :tada: [${latestTag}](${noOgpUrl}/releases/tag/${latestTag}) がリリースされました\non: [QTheme v2](//qtheme.trap.games)${
    commits === '' ? '' : '\n\n'
  }${commits}\n\n(変更の反映には数分かかります)`

  return body
}
