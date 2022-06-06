import { Application } from 'express'
import { bindRoutes as bindUserRoutes } from './user'

export const bindRoutes = (app: Application, prefix = '/v1') => {
    bindUserRoutes(app, prefix)
}
