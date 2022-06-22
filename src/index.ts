import { server } from './server'

server.listen(parseInt(process.env.PORT ?? '8080'), () => {
  console.log('Listening')
})
