require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

// uncomment all for logging to file using stream - logs to console by default
// const fs = require('fs')
// const path = require('path')
// const appLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'))

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

// GET route -- find number of entries and display date
app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => persons.length)
    .then(length =>
      response.send(
        `<p>Phonebook has info for ${length} people</p><p>${new Date()}`,
      ),
    )
    .catch(error => next(error))
})

// GET route -- find all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET route -- find person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(foundPerson => response.json(foundPerson))
    .catch(error => next(error))
})

// POST route - save new person
app.post('/api/persons', (request, response) => {
  const body = request.body
  // for morgan logging
  request.info = body
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).send({
      error: 'both name and number are required',
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// PUT route -- update person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  request.info = body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// DELETE route - remove person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => next(error))

  response.status(204).end()
})

// 404
const unknownEndpoint = (request, response) => {
  response.status(404).send(four04)
}

app.use(unknownEndpoint)

// Custom error middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
