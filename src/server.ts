import express from 'express'
import { createServer } from 'http'
import { bindLogger } from './logging'
import { bindRoutes } from './routes'

const app = express()

bindLogger(app)
bindRoutes(app)

export const server = createServer(app)
