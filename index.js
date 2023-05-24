const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const pathJSON = path.join(__dirname, './db.json')

const readJSON = () => {
  const template = {
    tasks: [],
  }
  try {
    const data = fs.readFileSync(pathJSON, 'utf8')
    if (!data.length) {
      return template
    }
  } catch (err) {
    fs.writeFileSync(pathJSON, JSON.stringify(template, null, 2), 'utf-8')
  }
  const data = fs.readFileSync(pathJSON, 'utf8')
  return JSON.parse(data)
}

const writeJSON = (data) => {
  const template = {
    tasks: data,
  }
  fs.writeFileSync(pathJSON, JSON.stringify(template, null, 2), 'utf-8')
}

const { tasks } = readJSON()

tasks.push({
  title: 'Cocinar',
  id: crypto.randomUUID(),
})

writeJSON(tasks)

console.log(tasks)
