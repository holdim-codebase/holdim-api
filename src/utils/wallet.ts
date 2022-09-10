import { repositories } from '../repositories'
import { getWalletAssets } from '../repositories/user'
import { processWalletAddress } from '../services/blockchain'
import { filterAssetsByPrice } from '../services/zerion/utils'

export const processNewWallet = async (walletAddress: string) => {
  const { hexAddress, ens } = await processWalletAddress(walletAddress)
  const assets = filterAssetsByPrice(await getWalletAssets.load(hexAddress))
  let daosToFollow = await repositories.dao.findMany({ where: { Token: { some: { id: { in: Object.keys(assets).map(address => address.toLowerCase()) } } } } })

  if (!daosToFollow.length) {
    daosToFollow = await repositories.dao.findMany()
  }

  return {
    hexAddress,
    ens,
    daosToFollow,
  }
}
