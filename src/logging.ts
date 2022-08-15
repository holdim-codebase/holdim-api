import { PluginDefinition } from 'apollo-server-core'
import pino from 'pino'

export const logger = pino({ level: 'debug' })

export const loggingPlugin: PluginDefinition = {
  async requestDidStart(requestContext) {
    if (requestContext.request.operationName === 'IntrospectionQuery') {
      return {}
    }

    logger.info({ message: 'GraphQL Request', request: requestContext.request, context: requestContext.context })

    return {
      async didEncounterErrors(requestContext) {
        logger.error({ message: 'GraphQL Request failed', request: requestContext.request, context: requestContext.context, errors: requestContext.errors })
      },
      async willSendResponse(requestContext) {
        logger.info({ message: 'GraphQL Response', request: requestContext.request, context: requestContext.context, response: requestContext.response })
      },
    }
  },
}
