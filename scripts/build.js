#!/usr/bin/env babel-node

import path from "path"
import fs from "fs-extra"
import glob from "glob"
import matter from "gray-matter"
import jade from "jade"
import fmt from "chalk"
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"

const CONTENT_DIR = "content"
const BUILD_DIR = "build"

const render = jade.compileFile("template.jade", {pretty: true})
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

function isMd(file) {
  return file.endsWith(".md")
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
    document.data.formattedContent = md.render(document.content)

    try {
      fs.writeFileSync(destination, render(document.data))
    } catch (err_) {
      console.error(err_)
    }
  })

  console.log(fmt.green(`${source} -> ${destination}`))
}

function copyFile(source) {
  const destination = convertPath(source)

  try {
    fs.ensureDirSync(path.dirname(destination))
    fs.copySync(source, destination)
    console.log(fmt.green(`${source} -> ${destination}`))
  } catch (err) {
    console.error(err)
  }
}

function processFile(file) {
  if (isMd(file)) {
    processMarkdown(file)
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
