import {renderString, tree} from "deku"
import element from "virtual-element"
import glob from "glob"

import pkg from "./package"

function processFile(fileName) {
  const outputFileName = fileName
    .replace(/^content/, "build")
    .replace(/\.md$/ ".html")
}

glob("content/**/*.md", (err, files) => {
  if (err) {
    throw Error("Unable to get site contents")
  }

  files.forEach(processFile)
})
