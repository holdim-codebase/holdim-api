import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getTokenInfo } from '../repositories/token'
import { getWalletAssets } from '../repositories/user'

export const tokenPersonlizedDataResolver: Resolvers['TokenPersonalizedData'] = {
  quantity: async ({ id }, args, ctx) => {
    const user = await repositories.user.findUnique({ where: { id: ctx.user.uid } })
    const walletAssets = await getWalletAssets.load(user!.walletAddress)
    return walletAssets[id]?.quantity ?? 0
  },
}

export const tokenResoler: Resolvers['Token'] = {
  id: ({ id }) => id,
  name: ({ name }) => name,
  main: async ({ id }) => (await (repositories.token.findUnique({ where: { id } })))?.main ?? null,
  marketCap: async ({ id }) => {
    const token = await getTokenInfo.load(id)
    return token.market_cap ?? null
  },
  totalSupply: async ({ id }) => {
    const token = await getTokenInfo.load(id)
    return token.total_supply ?? null
  },
  price: async ({ id }) => {
    const token = await getTokenInfo.load(id)
    return token.asset.price?.value ?? null
  },
  decimals: async ({ id }) => {
    const token = await getTokenInfo.load(id)
    return token.asset.decimals
  },
  symbol: async ({ id }) => {
    const token = await getTokenInfo.load(id)
    return token.asset.symbol
  },
  personalizedData: token => token,
}

export const tokenQueryResolvers: Resolvers['Query'] = {}

export const tokenMutationResolvers: Resolvers['Mutation'] = {}
