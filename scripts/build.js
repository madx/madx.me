#!/usr/bin/env babel-node

import path from "path"
import fs from "fs-extra"
import glob from "glob"
import matter from "gray-matter"
import jade from "jade"
import fmt from "chalk"
import MarkdownIt from "markdown-it"
import cssnext from "cssnext"
import hljs from "highlight.js"

const CONTENT_DIR = "content"
const BUILD_DIR = "build"

function render(template, context) {
  const renderer = template in render.__renderers__ ?
    render.__renderers__[template]
    :
    jade.compileFile(`templates/${template}.jade`, {pretty: true})

  if (!(template in render.__renderers__)) {
    render.__renderers__[template] = renderer
  }

  return renderer(context)
}
render.__renderers__ = {}

const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: false,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const hlCode = hljs.highlight(lang, str).value
        return `<pre class="hljs"><code class="${lang}">${hlCode}</code></pre>`
      } catch (err) {
        console.warn(err)
      }
    }

    return ""
  },
})

function contentPath(...pathComponents) {
  return path.join(CONTENT_DIR, ...pathComponents)
}

function buildPath(...pathComponents) {
  return path.join(BUILD_DIR, ...pathComponents)
}

function convertPath(contentRelativePath) {
  return buildPath(path.relative(CONTENT_DIR, contentRelativePath))
}

function isMarkdown(file) {
  return file.endsWith(".md")
}

function isCSS(file) {
  return file.endsWith(".css")
}

function die(error) {
  console.error(error)
  process.exit(1)
}

function processMarkdown(source) {
  const destination = convertPath(source).replace(/\.md$/, ".html")

  fs.ensureFile(destination, (err) => {
    if (err) {
      return console.error(err)
    }

    const document = matter.read(source)
    document.data.template = document.data.template || "default"
    document.data.url = `http://madx.me${destination.replace(/^build/, "")}`
    document.data.formattedContent = md.render(document.content)

    try {
      const output = render(document.data.template, document.data)
      fs.writeFileSync(destination, output)
    } catch (err_) {
      console.error(err_)
    }
  })

  console.log(fmt.green(`convert ${source}`))
}

function processCSS(source) {
  const destination = convertPath(source)

  fs.ensureFile(destination, (err) => {
    if (err) {
      return console.error(err)
    }

    const input = fs.readFileSync(source)

    try {
      const output = cssnext(input.toString(), {
        from: source,
        to: destination,
      })
      fs.writeFileSync(destination, output)
    } catch (err_) {
      console.error(err_)
    }
  })

  console.log(fmt.green(`convert ${source}`))
}

function copyFile(source) {
  const destination = convertPath(source)

  try {
    fs.ensureDirSync(path.dirname(destination))
    fs.copySync(source, destination)
    console.log(fmt.green(`copy ${source}`))
  } catch (err) {
    console.error(err)
  }
}

function processFile(file) {
  const stats = fs.lstatSync(file)

  if (stats.isDirectory()) {
    // Skip directories
    console.info(fmt.gray(`skip ${file}`))
  } else if (isMarkdown(file)) {
    processMarkdown(file)
  } else if (isCSS(file)) {
    processCSS(file)
  } else {
    copyFile(file)
  }
}


// Main
glob(contentPath("**/*"), (err, files) => {
  if (err) {
    die(err)
  }

  files.forEach(file => processFile(file))
})
