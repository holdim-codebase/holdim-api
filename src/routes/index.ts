import { Application, RequestHandler } from 'express'
import { bindRoutes as bindUserRoutes } from './user'
import { firebaseAdmin } from '../services/firebase'

const authMiddleware: RequestHandler = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const [, bearerToken] = authHeader?.split('') ?? []
    if (!bearerToken) {
        req.log.error('Missing bearer token')
        return res.sendStatus(401)
    }

    try {
        const firebaseUser = await firebaseAdmin.auth().verifyIdToken(bearerToken)
        req.context = { ...req.context, user: firebaseUser }
    } catch (error) {
        req.log.error(error)
        return res.sendStatus(401)
    }

    next()
}

export const bindAuthRoutes = (app: Application, prefix = '/v1') => {
    app.use(authMiddleware)
    bindUserRoutes(app, prefix)
}
