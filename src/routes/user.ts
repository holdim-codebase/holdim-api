import express, { Application } from 'express'

const router = express.Router({ mergeParams: true })

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/user/register', async (req, res, next) => {
})

export const bindRoutes = (app: Application, prefix: string) => {
  app.use(prefix, router)
}
