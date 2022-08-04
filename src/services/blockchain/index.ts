import { providers } from 'ethers'
import { config } from '../../config'

interface WalletAddress {
  hexAddress: string
  ens?: string
}

const ethereumProvider = new providers.AlchemyProvider(1, config.services.alchemy.apiKey)

const ADDRESS_REG_EXP = /0x[0-9a-z]{40}/g

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
    case Boolean(address.match(ADDRESS_REG_EXP)):
      return { hexAddress: address }
    default:
      throw new Error('Unknown addres type')
  }
}
