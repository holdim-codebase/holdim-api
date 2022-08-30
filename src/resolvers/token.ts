import { ApolloError } from 'apollo-server'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getTokenInfo } from '../repositories/token'
import { getWalletAssets } from '../repositories/user'
import { formatTokenWithDecimals } from '../utils'

export const tokenPersonalizedDataResolver: Resolvers['TokenPersonalizedData'] = {
  quantity: async ({ id }, args, ctx) => {
    if (!ctx.wallet) {
      throw new ApolloError('Missing user wallet')
    }
    const token = await getTokenInfo.load(id)
    const walletAssets = await getWalletAssets.load(ctx.wallet.address)
    const quantityWithoutDivisionByDecimals = walletAssets[id]?.quantity ?? '0'
    return formatTokenWithDecimals(quantityWithoutDivisionByDecimals, token.asset.decimals)
  },
}

export const tokenResolver: Resolvers['Token'] = {
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
  symbol: async ({ id }) => {
    const token = await getTokenInfo.load(id)
    return token.asset.symbol
  },
  personalizedData: (token, args, ctx) => ctx.wallet ? token : null,
}

export const tokenQueryResolvers: Resolvers['Query'] = {}

export const tokenMutationResolvers: Resolvers['Mutation'] = {}
