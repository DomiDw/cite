const path = require('path')
const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

module.exports.main = (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
}

module.exports.randomQuotes = async (req, res) => {
  const query = datastore.createQuery('Cite')
  const [cites] = await datastore.runQuery(query)
  let randomInput = {}
  randomInput = cites[37]
  res.json(randomInput)
}

module.exports.allQuotes = async (req, res) => {
  const query = datastore.createQuery('Cite')
  const [cites] = await datastore.runQuery(query)
  cites.sort(function (a, b) { return a.RowKey - b.RowKey })
  res.json(cites)
}

module.exports.deleteQuote = async (req, res) => {
  const citeId = req.params.key
  const taskKey = datastore.key(['Cite', citeId])
  await datastore.delete(taskKey)
  console.log(`Task ${citeId} deleted successfully.`)
  res.sendStatus(200)
}

module.exports.addNewQuote = async (req, res) => {
  const query = datastore.createQuery('Cite')
  const [cites] = await datastore.runQuery(query)
  const arrKey = []
  for (let i = 0; i < cites.length; i++) {
    arrKey.push(cites[i].RowKey)
  }
  arrKey.sort((a, b) => a - b)
  let newKey = arrKey.pop()
  newKey++
  const citeKey = datastore.key(['Cite', '' + newKey])
  const entity = {
    key: citeKey,
    data: [
      {
        name: 'RowKey',
        value: newKey.toString()
      },
      {
        name: 'PartitionKey',
        value: req.body.PartitionKey
      },
      {
        name: 'cite',
        value: req.body.cite
      },
      {
        name: 'count',
        value: 1
      },
      {
        name: 'author',
        value: req.body.author
      },
      {
        name: 'Timestamp',
        value: new Date().toJSON()
      }
    ]
  }
  await datastore.save(entity)
  console.log(`Task ${newKey} created successfully.`)
  res.sendStatus(200)
}

module.exports.randomQuotesAmount = async (req, res) => {
  const query = datastore.createQuery('Cite')
  const [cites] = await datastore.runQuery(query)
  const arrQuotes = []
  const count = req.params.amount
  for (let i = 0; i < count; i++) {
    let randomInput = {}
    randomInput = cites[Math.floor(Math.random() * cites.length)]
    arrQuotes.push(randomInput)
  }
  arrQuotes.sort(function (a, b) { return a.RowKey - b.RowKey })

  res.json(arrQuotes)
}

module.exports.author = async (req, res) => {
  const query = datastore.createQuery('Cite')
  const [cites] = await datastore.runQuery(query)
  const arrQuotes = []
  for (let i = 0; i < cites.length; i++) {
    if (cites[i].author.trim() === req.params.name) {
      arrQuotes.push(cites[i])
    }
  }
  arrQuotes.sort(function (a, b) { return a.RowKey - b.RowKey })
  res.json(arrQuotes)
}

module.exports.changeQuote = async (req, res) => {
  const transaction = datastore.transaction()
  const citeId = req.body.key
  const citeKey = datastore.key(['Cite', citeId])
  try {
    await transaction.run()
    const [cite] = await transaction.get(citeKey)
    cite.cite = req.body.newQuote
    cite.author = req.body.author
    cite.PartitionKey = req.body.newPartitionKey
    cite.Timestamp = new Date().toJSON()
    transaction.save({
      key: citeKey,
      data: cite
    })
    await transaction.commit()
    console.log(`Task ${citeId} changed successfully.`)
    res.sendStatus(200)
  } catch (err) {
    transaction.rollback()
    throw err
  }
}
