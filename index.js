const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
// uncomment all for logging to file using stream - logs to console by default
// const fs = require('fs')
// const path = require('path')
// const appLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'))

let persons = [
  {
    name: 'Jerry Cantrell',
    number: '867-5309',
    id: 1,
  },
  {
    name: 'Jim Gaffigan',
    number: '555-2121',
    id: 2,
  },
  {
    name: 'Dwight D. Eisenhauer',
    number: '867-5310',
    id: 3,
  },
  {
    name: 'Vladimir Putin',
    number: '666-1212',
    id: 4,
  },
]
const entries = persons.length
const four04 = `<body style="background: orangered;">
<h1 style="position: fixed; top: 48%; left: 37%; color: white; text-shadow: 1px 1px 1px #000;">404 - Resource Not Found</h1>`

const app = express()

app.use(
  morgan(
    // 'tiny',
    ':method :url :status :res[content-length] :response-time ms :info',
    // {
    //   stream: appLogStream,
    // },
  ),
)

// injected into app.post route
morgan.token('info', req => JSON.stringify(req.info))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${entries} people</p><p>${new Date()}`,
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const foundPerson = persons.find(person => person.id === id)
  if (foundPerson) {
    response.json(foundPerson)
  } else {
    response.status(404).send(four04)
  }
})

const getRandom = () => {
  return Math.floor(Math.random() * 10000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  // for morgan logging
  request.info = body
  if (!body.name || !body.number) {
    return response.status(400).send({
      error: 'both name and number are required',
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(404).send({
      error: 'name must be unique',
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: getRandom(),
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
