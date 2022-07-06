import { Token } from '@prisma/client'
import DataLoader from 'dataloader'
import { logger } from '../logging'
import { zerionService } from '../services/zerion'
import { ZerionNamespaces } from '../services/zerion/types'

export const getTokenInfo = new DataLoader<Token['id'], ZerionNamespaces.AssetsNamespace.AssetInfo>(
  tokenIds => {
    return Promise.all(tokenIds.map(async tokenId => {
      try {
        logger.debug({ tokenId, message: 'Request token' })
        return (await zerionService.getTokenInfo([tokenId]))[0]
      } catch (error) {
        logger.error({ tokenId, message: 'Request token failed' })
        return new Error('Failed to get token info')
      }
    }))
  }
)
