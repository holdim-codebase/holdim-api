import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getTokenInfo } from '../repositories/token'
import { ZerionNamespaces } from '../services/zerion/types'

export const daoPersonalizedDataResolver: Resolvers['DaoPersonalizedData'] = {
  followed: ({ id: daoId }, args, ctx) => repositories.userDaoFollow.findUnique({
    where: { daoId_userId: { daoId: Number(daoId), userId: ctx.user.uid } },
  }).then(Boolean),
}

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

  personalizedData: dao => dao,
}

export const daoQueryResolver: Resolvers['Query'] = {
  daos: (parent, { ids, onlyFollowed }, ctx) => {
    const whereQuery: Parameters<typeof repositories['dao']['findMany']>[0] = ids ? { where: { id: { in: ids.map(id => parseInt(id)) } } } : {}

    if (onlyFollowed) {
      whereQuery.where = { ...whereQuery.where, UserDaoFollow: { some: { userId: ctx.user.uid } } }
    }

    return repositories.dao.findMany(whereQuery)
  },
}

export const daoMutationResolver: Resolvers['Mutation'] = {
  followDao: async (parent, { daoId }, ctx) => {
    await repositories.userDaoFollow.upsert({
      select: { daoId: true },
      where: { daoId_userId: { daoId: Number(daoId), userId: ctx.user.uid } },
      create: { daoId: Number(daoId), userId: ctx.user.uid },
      update: {},
    })

    return (await repositories.dao.findUnique({ where: { id: Number(daoId) } }))!
  },
  unfollowDao: async (parent, { daoId }, ctx) => {
    await repositories.userDaoFollow.delete({
      where: { daoId_userId: { daoId: Number(daoId), userId: ctx.user.uid } },
    })

    return (await repositories.dao.findUnique({ where: { id: Number(daoId) } }))!
  },
}
