import express, { Application } from 'express'
import { repositories } from '../repositories'
import { route } from './utils'

const router = express.Router({ mergeParams: true })

router.post('/user/register', route(async (context, body) => {
  return repositories.user.create({ select: { id: true, publicId: true }, data: { id: context.user.uid, publicId: body.publicId }})
}))

export const bindRoutes = (app: Application, prefix: string) => {
  app.use(prefix, router)
}
