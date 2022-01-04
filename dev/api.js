const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Please change')
})

app.listen(3000)