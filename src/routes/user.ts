import express, { Application } from 'express'

const router = express.Router({ mergeParams: true })

router.post('/user/register', async (req, res, next) => {
  res.sendStatus(200)
})

export const bindRoutes = (app: Application, prefix: string) => {
  app.use(prefix, router)
}
