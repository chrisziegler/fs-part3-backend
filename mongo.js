const mongoose = require('mongoose')

const args = process.argv.slice(2)
const [password, name, number] = args
if (!password) {
  console.log(
    'Please provide the password as a required argument: node mongo.js <password> <name> <number>',
  )
  process.exit(1)
}

if (args.length === 2) {
  console.log(
    'Please provide both a name AND a number to add to phonebook',
  )
  process.exit(1)
}

const dbName = 'phone-app'
const url = `mongodb+srv://cz-fs-helsinki:${password}@cluster0.otgwe.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    name,
    number,
  })
  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (args.length === 1) {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}
