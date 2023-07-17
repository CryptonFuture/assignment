const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const userRoutes = require('./routers/user')
const { createLogger, transports } = require('winston')

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '2mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))

const prefix = '/api/v1'

app.use(prefix, userRoutes)

const logger = createLogger({
    exceptionHandlers: [new transports.File({ filename: 'exceptions.log' })]
})

module.exports = app