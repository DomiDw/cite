#!/usr/bin/env node
const quotesController = require('./controller/quotes.js')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Connect to port 4000 on the localhost
app.listen(4000, function () {
  console.log('Server is online')
})

// Path to the file
app.get('/', quotesController.main)

// Show random quotes
app.get('/quotes/random', quotesController.randomQuotes)

// Show a specific amount of random quotes
app.get('/quotes/random/:amount', quotesController.randomQuotesAmount)

// Show all quoutes
app.get('/quotes', quotesController.allQuotes)

// Show all quotes of a specific author
app.get('/quotes/author/:name', quotesController.author)

// Add a new quote to an auto incremented RowKey
app.post('/quotes/addNew/:showNewQuote/:authorFullName/:newCategory', quotesController.addNewQuote)

// Change a specific quote depending on the RowKey
app.put('/quotes/change/:key/:newQuote/:author/:newCategory', quotesController.changeQuote)

// Delete a quote depending on the RowKey
app.delete('/quotes/delete/:key', quotesController.deleteQuote)
