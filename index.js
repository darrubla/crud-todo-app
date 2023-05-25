const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const PORT = process.env.PORT || 3500

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

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

//1. Get all
app.get('/tasks', (req, res) => {
  const { tasks } = readJSON()
  res.status(200).json(tasks)
})

//2. Post (Se envía el body)
app.post('/tasks', (req, res) => {
  const { body } = req
  const { tasks } = readJSON()
  const exist = tasks.find((task) => task.title === body.title)
  if (exist) {
    res.status(401).json({ message: 'Already exists a task with this title' })
  } else {
    tasks.push({
      title: body.title,
      isDone: false,
      id: crypto.randomUUID(),
    })
    writeJSON(tasks)
    res.status(201).json(body)
  }
})

//3. Put (Se envía el body)
app.put('/tasks/:title', (req, res) => {
  const { title } = req.params
  const { isDone } = req.body
  const { tasks } = readJSON()
  const task = tasks.find((task) => task.title === title)

  if (!task) {
    return res.status(404).json({ message: 'task not found' })
  } else {
    task.isDone = isDone
    writeJSON(tasks)
    res.status(200).json(task)
  }
})

//5. Delete
app.delete('/tasks/:title', (req, res) => {
  const { title } = req.params
  const { tasks } = readJSON()
  const index = tasks.findIndex((task) => task.title === title)

  if (index === -1) {
    return res.status(404).json({ message: 'task not found' })
  } else {
    tasks.splice(index, 1)
    writeJSON(tasks)
    res.status(200).json({ message: 'task succesfuly deleted' })
  }
})

app.use((req, res, next) => {
  next({
    statusCode: 404,
    message: 'Route Not Found',
  })
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Error' } = err
  res.status(statusCode)
  res.json({
    message,
  })
})
