import { Token } from '@prisma/client'
import { logger } from '../../logging'
import { getSocket } from './sockets'
import { NamespaceSocket, ZerionRequest, ZerionNamespaces } from './types'

// Feel free to change structure of this service

const request = (socketNamespace: NamespaceSocket, request: ZerionRequest) => {
  const [action, requestBody] = request
    logger.info({ message: 'Zerion request', action, requestBody })
    return new Promise<any>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Zerion request timed out')), 10e3)
    const { socket, namespace } = socketNamespace
    const handleReceive = (data: any) => {
      logger.info({ message: 'Zerion response', action, requestBody, response: data })
      if (data.meta.status === 'ok') {
        clearTimeout(timer)
        resolve(data)
      }
      reject(new Error(`Invalid data: ${JSON.stringify(data)}`))
    }
    const model = requestBody.scope[0]
    const topic = `received ${namespace} ${model}`
    socket.on(topic, handleReceive)
    socket.emit(action, requestBody)
  })
}

class ZerionService {
  private readonly adddressSocket: NamespaceSocket
  private readonly assetsSocket: NamespaceSocket

  constructor() {
    this.adddressSocket = getSocket('address')
    this.assetsSocket = getSocket('assets')
  }

  getPortfolioByAddress = async (walletAddress: string) => {
    const socketNamespace = getSocket('address')
    const response: ZerionNamespaces.AddressNamespace.PortfolioByAddressResponse = await request(
      this.adddressSocket,
      [
        'get',
        {
          scope: ['assets'],
          payload: {
            address: walletAddress,
          },
        },
      ]
    )

    await socketNamespace.socket.disconnect()

    return response.payload.assets
  }

  /**
   *
   * @param tokenIds
   * @returns If token is not found -> it's missing in response
   */
  getTokenInfo = async (tokenIds: ReadonlyArray<Token['id']>): Promise<ZerionNamespaces.AssetsNamespace.AssetInfo[]> => {
    const socketNamespace = getSocket('assets')
    const response = await request(
      socketNamespace,
      [
        'get',
        {
          scope: ['info'],
          payload: {
            asset_codes: tokenIds,
          },
        },
      ]
    )

    await socketNamespace.socket.disconnect()

    return response.payload.info
  }
}

export const zerionService = new ZerionService()
