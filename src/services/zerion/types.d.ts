export interface NamespaceSocket {
  namespace: 'address'|'assets'
  socket: any
}

export type ZerionRequest = ['get', { scope: string[], payload: Record<string, any> }]

export namespace ZerionNamespaces {
  export interface Price {
    value: number
    relative_change_24h?: number
    changed_at: number
  }

  export interface Asset {
    id: string
    asset_code: string
    name: string
    symbol: string
    decimals: number
    implementations?: Record<string, { address: string, decimals: number }>
    type?: null|'stablecoin'|'one-inch'|string
    icon_url?: string
    price?: Price
    is_displayable: boolean
    is_verifies: boolean
  }

  export namespace AddressNamespace {
    export interface PortfolioByAddressResponse {
      payload: {
        assets: AssetsResponse
      }
    }

    export interface AssetsResponse {
        [tokenId: string]: {
          asset: Asset
          quantity: string
        }
    }
  }

  export namespace AssetsNamespace {
    export interface AssetInfo {
      asset: Asset
      title: string
      gradient_color?: string
      explore_sections?: number
      subtitle?: string
      tagline?: string
      market_cap?: number
      total_supply?: number
      circulating_supply?: number
      relative_changes?: string
      tags?: string
    }
  }
}
