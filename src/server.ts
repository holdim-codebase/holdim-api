import express, { ErrorRequestHandler, RequestHandler } from 'express'
import { createServer } from 'http'
import { bindLogger } from './logging'
import { bindAuthRoutes } from './routes'

const app = express()

bindLogger(app)
bindAuthRoutes(app)

app.use(((err, req, res, next) => {
  res.sendStatus(500)
}) as ErrorRequestHandler)

export const server = createServer(app)
