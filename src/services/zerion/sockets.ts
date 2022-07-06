import io from 'socket.io-client'
import { config } from '../../config'

import { NamespaceSocket } from './types'

export const getSocket = (namespace: 'address'|'assets'): NamespaceSocket => ({
  namespace,
  socket: io(`${config.services.zerion.url}${namespace}`, {
    transports: ['websocket'],
    timeout: 60000,
    query: {
      api_token: config.services.zerion.apiKey,
    },
  }),
})
