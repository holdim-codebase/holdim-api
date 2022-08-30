import { Wallet } from '@prisma/client'
import DataLoader from 'dataloader'
import { logger } from '../logging'
import { zerionService } from '../services/zerion'
import { ZerionNamespaces } from '../services/zerion/types'
import { redisWrapper } from './redis'
import { DATALOADER_PARAMS } from './redis/keys'

export const getWalletAssets = new DataLoader<Wallet['address'], ZerionNamespaces.AddressNamespace.PortfolioByAddressResponse['payload']['assets']>(
  walletAddresses => {
    return Promise.all(walletAddresses.map(async walletAddress => {
      try {
        return await redisWrapper(
          DATALOADER_PARAMS.walletAssets.keyGen(walletAddress),
          zerionService.getPortfolioByAddress.bind(null, walletAddress),
          DATALOADER_PARAMS.walletAssets.ttl
        )
      } catch (error) {
        logger.error(error)
        return new Error('Failed to fetch wallet assets')
      }
    }))
  },
  { cache: false }
)
