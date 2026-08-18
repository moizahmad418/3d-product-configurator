/**
 * Post-build steps for GitHub Pages.
 *
 * 1. .nojekyll — Pages pipes uploads through Jekyll by default, which silently
 *    drops files and folders whose names begin with an underscore. This empty
 *    file turns that off.
 *
 * 2. 404.html — a copy of index.html. Pages serves it for any path that isn't a
 *    real file, so the app still boots if someone lands on or refreshes a deep
 *    link. Not strictly needed today (this app is a single page), but it costs
 *    nothing and means routing can be added later without surprises.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '..', 'dist')

if (!fs.existsSync(dist)) {
  console.error('postbuild: dist/ not found — run the build first.')
  process.exit(1)
}

fs.writeFileSync(path.join(dist, '.nojekyll'), '')
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))

console.log('Postbuild complete: dist/.nojekyll and dist/404.html written.')
