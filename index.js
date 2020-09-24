const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

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

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const foundPerson = persons.find(person => person.id === id)
  if (foundPerson) {
    response.json(foundPerson)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map(note => note.id)) : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'both name and number are required',
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
