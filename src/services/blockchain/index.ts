import { ethers, providers } from 'ethers'
import { config } from '../../config'

interface WalletAddress {
  hexAddress: string
  ens?: string
}

const ethereumProvider = new providers.AlchemyProvider(1, config.services.alchemy.apiKey)

/**
 *
 * @param address Can be ENS domain or hexadecimal wallet address
 */
export const processWalletAddress = async (address: string): Promise<WalletAddress> => {
  switch (true) {
    case address.endsWith('.eth'): {
      const hexAddress = await ethereumProvider.resolveName(address)
      if (!hexAddress) { throw new Error('Unknown ENS address') }
      return { hexAddress, ens: address }
    }
    case Boolean(ethers.utils.isAddress(address)):
      return { hexAddress: address }
    default:
      throw new Error('Unknown address type')
  }
}
