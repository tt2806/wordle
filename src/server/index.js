const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const url = process.env.MONGODB_URI

mongoose.connect(url)
const scoreSchema = new mongoose.Schema({
  solutionIndex: Number,
  solution: String,
  guesses: [String],
  lost: Boolean,
  isHardMode: Boolean,
  emojiGrid: String,
})

const Score = mongoose.model('Score', scoreSchema)

app.post('/api/scores', (req, res) => {
  const score = new Score(req.body)

  score.save().then((savedScore) => {
    res.json(savedScore)
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'))
  })
}
