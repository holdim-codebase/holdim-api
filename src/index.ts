import { server } from './server'

server.listen({
  port: parseInt(process.env.PORT ?? '8080')
})
