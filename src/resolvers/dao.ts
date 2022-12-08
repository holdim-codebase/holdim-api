import { ApolloError } from 'apollo-server'
import { POSTGRES_ERROR_CODES } from '../errors/postgres'
import { Resolvers, ResolversTypes } from '../generated/graphql'
import { logger } from '../logging'
import { repositories } from '../repositories'
import { getTokenInfo } from '../repositories/token'
import { ZerionNamespaces } from '../services/zerion/types'
import { paginatedResult } from '../utils/pagination'

export const daoPersonalizedDataResolver: Resolvers['DaoPersonalizedData'] = {
  followed: ({ id: daoId }, args, ctx) => {
    if (!ctx.wallet) { throw new ApolloError('Missing wallet id') }
    return repositories.walletDaoFollow.findUnique({
      where: { daoId_walletId: { daoId: Number(daoId), walletId: ctx.wallet.id } },
    }).then(Boolean)
  },
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
      if (!ctx.wallet) {
        throw new ApolloError('Cannot request only followed daos without wallet')
      }
      whereQuery.where = { ...whereQuery.where, WalletDaoFollow: { some: { walletId: ctx.wallet.id } } }
    }

    return repositories.dao.findMany({ take: 10, ...whereQuery })
  },
  daosV2: async (parent, { first, after, ids, onlyFollowed, search }, ctx) => {
    if (ctx.organization) {
      onlyFollowed = false
    }
    if (!ctx.organization && !ctx.wallet) {
      throw new ApolloError('Missing wallet')
    }

    const query: Parameters<typeof repositories['dao']['findMany']>[0] = {
      where: {
        name: { contains: search ?? undefined, mode: 'insensitive' },
        id: ids ? { in: ids.map(Number) } : undefined,
        WalletDaoFollow: onlyFollowed
          ? { some: { walletId: ctx.wallet!.id } }
          : undefined,
      },
      orderBy: { id: 'desc' },
    }

    return paginatedResult(
      repositories.dao,
      query.where!,
      query.orderBy!,
      first ?? undefined,
      after ?? undefined
    ) as ResolversTypes['DAOConnection']
  },
}

export const daoMutationResolver: Resolvers['Mutation'] = {
  followDao: async (parent, { daoId }, ctx) => {
    if (!ctx.wallet) {
      throw new ApolloError('Missing user wallet')
    }
    await repositories.walletDaoFollow.upsert({
      select: { daoId: true },
      where: { daoId_walletId: { daoId: Number(daoId), walletId: ctx.wallet.id } },
      create: { daoId: Number(daoId), walletId: ctx.wallet.id },
      update: {},
    })

    return (await repositories.dao.findUnique({ where: { id: Number(daoId) } }))!
  },
  unfollowDao: async (parent, { daoId }, ctx) => {
    if (!ctx.wallet) {
      throw new ApolloError('Missing user wallet')
    }
    try {
      await repositories.walletDaoFollow.delete({
        where: { daoId_walletId: { daoId: Number(daoId), walletId: ctx.wallet.id } },
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
