import { formatTokenWithDecimals } from '../../utils'
import { ZerionNamespaces } from './types'

type Wallet = ZerionNamespaces.AddressNamespace.PortfolioByAddressResponse['payload']['assets']

export const filterAssetsByPrice = (assets: Wallet, priceInUsd = 1): ZerionNamespaces.AddressNamespace.PortfolioByAddressResponse['payload']['assets'] => {
  return Object.fromEntries(
    Object.entries(assets)
      .map(([assetAddress, asset]) => {
        const assetValue = asset?.asset.price?.value
        if (!assetValue) { return [assetAddress, asset] }
        if (assetValue * +formatTokenWithDecimals(asset.quantity, asset.asset.decimals) < priceInUsd) {
          return null
        }
        return [assetAddress, asset]
      })
      .filter((assetOrNull): assetOrNull is [string, Wallet[string]] => Boolean(assetOrNull))
  )
}
