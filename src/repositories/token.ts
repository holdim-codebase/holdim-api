import { Token } from '@prisma/client'
import DataLoader from 'dataloader'
import { logger } from '../logging'
import { zerionService } from '../services/zerion'
import { ZerionNamespaces } from '../services/zerion/types'
import { redisWrapper } from './redis'
import { DATALOADER_PARAMS } from './redis/keys'

export const getTokenInfo = new DataLoader<Token['id'], ZerionNamespaces.AssetsNamespace.AssetInfo>(
  tokenIds => {
    return Promise.all(tokenIds.map(async tokenId => {
      try {
        return await redisWrapper(
          DATALOADER_PARAMS.tokenInfo.keyGen(tokenId),
          zerionService.getTokenInfo.bind(null, tokenId),
          DATALOADER_PARAMS.tokenInfo.ttl
        )
      } catch (error) {
        logger.error({ tokenId, message: 'Request token failed' })
        return new Error('Failed to get token info')
      }
    }))
  }
)
