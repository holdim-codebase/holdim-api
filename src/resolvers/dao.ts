import { ApolloError } from 'apollo-server'
import { POSTGRES_ERROR_CODES } from '../errors/postgres'
import { Resolvers, ResolversTypes } from '../generated/graphql'
import { logger } from '../logging'
import { repositories } from '../repositories'
import { getTokenInfo } from '../repositories/token'
import { ZerionNamespaces } from '../services/zerion/types'
import { paginatedResult } from '../utils/pagination'

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
  tokens: async ({ id: daoId }, { onlyMain }) => {
    const tokenQuery: Parameters<typeof repositories['token']['findMany']>[0] = { where: { daoId }, orderBy: { createdAt: 'desc' } }
    if (onlyMain) { tokenQuery.where = { ...tokenQuery.where, main: true } }
    const tokens = await repositories.token.findMany(tokenQuery)

    const assetInfos = await getTokenInfo.loadMany(tokens.map(token => token.id))
    if (assetInfos.some(assetInfo => assetInfo instanceof Error)) {
      throw new ApolloError('Failed to fetch tokens')
    }

    return Object.values(assetInfos as ZerionNamespaces.AssetsNamespace.AssetInfo[]).filter(Boolean).map(assetInfo => assetInfo.asset)
  },

  personalizedData: dao => dao,
}

export const daoQueryResolver: Resolvers['Query'] = {
  daos: (parent, { ids, onlyFollowed }, ctx) => {
    const whereQuery: Parameters<typeof repositories['dao']['findMany']>[0] = ids ? { where: { id: { in: ids.map(id => parseInt(id)) } } } : { orderBy: { name: 'asc' } }

    if (onlyFollowed) {
      whereQuery.where = { ...whereQuery.where, UserDaoFollow: { some: { userId: ctx.user.uid } } }
    }

    return repositories.dao.findMany({ take: 10, ...whereQuery })
  },
  daosV2: async (parent, { first, after, ids, onlyFollowed }, ctx) => {
    const whereQuery = {
      id: ids ? { in: ids.map(Number) } : undefined,
      UserDaoFollow: onlyFollowed
        ? { some: { userId: ctx.user.uid } }
        : undefined,
    }

    return paginatedResult(
      repositories.dao,
      whereQuery,
      { id: 'desc' },
      first ?? undefined,
      after ?? undefined
    ) as ResolversTypes['DAOConnection']
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
    try {
      await repositories.userDaoFollow.delete({
        where: { daoId_userId: { daoId: Number(daoId), userId: ctx.user.uid } },
      })
    } catch (error) {
      if (typeof error === 'object' && (error as any)?.code !== POSTGRES_ERROR_CODES.DELETE_NOT_FOUND) {
        logger.error(error)
        throw error as Error
      }
    }

    return (await repositories.dao.findUnique({ where: { id: Number(daoId) } }))!
  },
}
