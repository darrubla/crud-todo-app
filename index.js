const express = require('express')
const app = express()

let items = [
  {
    name: 'aceite',
    price: 2500,
  },
]

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const PORT = process.env.PORT || 3500

const normalizeString = (str) => str.toLowerCase().replace(/-/g, ' ')

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//1. Get all
app.get('/items', (req, res) => {
  res.json(items)
})

//2. Post (Se envía el body)
app.post('/items', (req, res) => {
  const { body } = req
  const exist = items.find((item) => item.name === body.name)

  if (exist) {
    res.status(401).json({ message: 'Already exists an item with this name' })
  } else {
    items.push({
      name: body.name.toLowerCase(),
      price: body.price,
    })
    res.status(201).json(body)
  }
})

//3. Put (Se envía el body)
app.put('/items/:name', (req, res) => {
  const { name } = req.params
  const { price, name: newName } = req.body
  const item = items.find((item) => item.name === normalizeString(name))
  const itemIdx = items.findIndex((item) => item.name === normalizeString(name))
  const duplicated = items.find((item) => item.name === newName)
  const duplicatedIdx = items.findIndex((item) => item.name === newName)

  if (!item) {
    return res.status(404).json({ message: 'Item not found' })
  } else if (duplicated && itemIdx !== duplicatedIdx) {
    return res
      .status(401)
      .json({ message: 'Already exists an item with that name' })
  } else {
    item.name = newName
    item.price = price
    return res.status(200).json(item)
  }
})

//4. Delete
app.delete('/items/:name', (req, res) => {
  const { name } = req.params
  const index = items.findIndex((item) => item.name === normalizeString(name))

  if (index === -1) {
    return res.status(404).json({ message: 'item not found' })
  } else {
    items.splice(index, 1)
    res.status(204).json({ message: 'item succesfuly deleted' })
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
