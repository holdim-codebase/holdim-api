import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getTokenInfo } from '../repositories/token'
import { ZerionNamespaces } from '../services/zerion/types'

export const DaoResolver: Resolvers['DAO'] = {
  id: ({ id }) => id.toString(),
  logo: ({ logo }) => logo,
  name: ({ name }) => name,
  overview: ({ overview }) => overview,
  tokenOverview: ({ tokenOverview }) => tokenOverview,
  tokens: async ({ id: daoId }) => {
    const tokens = await repositories.token.findMany({ where: { daoId } })

    const assetInfos = await getTokenInfo.loadMany(tokens.map(token => token.id))
    if (assetInfos.some(assetInfo => assetInfo instanceof Error)) {
      throw new Error('Failed to fetch tokens')
    }

    return Object.values(assetInfos as ZerionNamespaces.AssetsNamespace.AssetInfo[]).map(assetInfo => assetInfo.asset)
  },
}

export const daoQueryResolver: Resolvers['Query'] = {
  daos: (parent, { ids }) => {
    const whereQuery: Parameters<typeof repositories['dao']['findMany']>[0] = ids ? { where: { id: { in: ids.map(id => parseInt(id)) } } } : {}
    return repositories.dao.findMany(whereQuery)
  },
}
