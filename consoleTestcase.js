const fs = require('fs')
const rawdata = fs.readFileSync('./quotes.json')
const file = JSON.parse(rawdata)

const inEins = process.argv[2]
const inZwei = process.argv[3]
const inDrei = process.argv[4]

const shuffle1 = file[Math.floor(Math.random() * file.length)].cite
console.log(shuffle1)

if (inEins > 0) {
  for (let i = 1; i < inEins; i++) {
    const shuffle = file[Math.floor(Math.random() * file.length)].cite
    console.log(shuffle)
  }
} else if (typeof inEins === 'string' && typeof inZwei === 'string') {
  for (let i = 0; i < file.length; i++) {
    if (file[i].author === inEins + ' ' + inZwei) {
      const asdf = file[i].cite
      console.log(asdf)
    }
  }
} else if (inEins === 'citeAll') {
  for (let i = 0; i < file.length; i++) {
    const shuffle = file[Math.floor(Math.random() * file.length)].cite
    console.log(shuffle)
  }
} else if (inEins === 'add') {
  if (inZwei !== undefined) {
    const obj = { cite: inZwei }
    file.push(obj)

    fs.writeFile('./quotes.json', JSON.stringify(file), function (err) {
      if (err) {
        return console.log(err)
      } else {
        console.log('The file was saved!')
      }
    })
  }
} else if (inEins === 'change') {
  for (let i = 0; i < file.length; i++) {
    if (file[i].RowKey === inZwei) {
      file[i].cite = inDrei

      fs.writeFile('./quotes.json', JSON.stringify(file), function (err) {
        if (err) {
          return console.log(err)
        } else {
          console.log('Quote changed.')
        }
      })
    }
  }
} else if (inEins === 'del') {
  for (let i = 0; i < file.length; i++) {
    if (file[i].RowKey === inZwei) {
      delete file[i].cite

      fs.writeFile('./quotes.json', JSON.stringify(file), function (err) {
        if (err) {
          return console.log(err)
        } else {
          console.log('Quote deleted!')
        }
      })
    }
  }
}