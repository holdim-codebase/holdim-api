import { Token } from '@prisma/client'
import { logger } from '../../logging'
import { getSocket } from './sockets'
import { NamespaceSocket, ZerionRequest, ZerionNamespaces } from './types'

// Feel free to change structure of this service

const request = (socketNamespace: NamespaceSocket, request: ZerionRequest) => {
  const [action, requestBody] = request
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => reject(new Error('Zerion request timed out')), 10e3)
    const { socket, namespace } = socketNamespace
    const handleReceive = (data: any) => {
      logger.debug({ action, requestBody, response: data })
      if (data.meta.status === 'ok') {
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

  getPortfolioByAddress = (walletAddress: string): Promise<ZerionNamespaces.AddressNamespace.PortfolioByAddressResponse> => request(
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

  /**
   *
   * @param tokenIds
   * @returns If token is not found -> it's missing in response
   */
  getTokenInfo = async (tokenIds: ReadonlyArray<Token['id']>): Promise<ZerionNamespaces.AssetsNamespace.AssetInfo[]> => (await request(
    this.assetsSocket,
    [
      'get',
      {
        scope: ['info'],
        payload: {
          asset_codes: tokenIds,
        },
      },
    ]
  )).payload.info
}

export const zerionService = new ZerionService()
