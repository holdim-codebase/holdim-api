import { User } from '@prisma/client'
import DataLoader from 'dataloader'
import { logger } from '../logging'
import { zerionService } from '../services/zerion'
import { ZerionNamespaces } from '../services/zerion/types'

export const getWalletAssets = new DataLoader<User['walletAddress'], ZerionNamespaces.AddressNamespace.PortfolioByAddressResponse>(
  walletAddresses => {
    return Promise.all(walletAddresses.map(async walletAddress => {
      try {
        return await zerionService.getPortfolioByAddress(walletAddress)
      } catch (error) {
        logger.error(error)
        return new Error('Failed to fetch wallet assets')
      }
    }))
  },
  { cache: false }
)
