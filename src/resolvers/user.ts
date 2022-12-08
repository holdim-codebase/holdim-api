import { User, Wallet } from '@prisma/client'
import { ApolloError } from 'apollo-server'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { processNewWallet } from '../utils/wallet'

export const userResolver: Resolvers['User'] = {
  id: ({ id }) => id,
  walletAddress: async (user) => (await repositories.wallet.findFirst({ where: { userId: user.id } }))?.address ?? '',
  wallet: user => repositories.wallet.findFirst({ where: { userId: user.id } }) as Promise<Wallet>,
  wallets: user => repositories.wallet.findMany({ where: { userId: user.id } }),
  followedDaos: ({ id: userId }, args, ctx) => {
    if (!ctx.wallet) {
      throw new ApolloError('Missing wallet')
    }
    return repositories.dao.findMany({ where: { WalletDaoFollow: { some: { walletId: ctx.wallet.id } } } })
  },
  avatarUrl: () => 'https://storage.googleapis.com/holdim-items/images/Frame%2043%20(1).png',
}

export const userQueryResolvers: Resolvers['Query'] = {
  me: (parent, args, ctx) => {
    if (!ctx.user) {
      throw new ApolloError('Must be user')
    }

    return repositories.user.findUnique({ where: { id: ctx.user.uid } }) as Promise<User>
  },
}

export const userMutationResolvers: Resolvers['Mutation'] = {
  registerUser: async (parent, args, ctx) => {
    if (!ctx.user) {
      throw new ApolloError('Must be user')
    }

    const { hexAddress, ens, daosToFollow } = await processNewWallet(args.walletAddress)

    return repositories.user.create({
      data: {
        id: ctx.user.uid,
        Wallet: {
          create: {
            address: hexAddress,
            ens,
            WalletDaoFollow: { createMany: { data: daosToFollow.map(dao => ({ daoId: dao.id })) } },
          },
        },
      },
    })
  },
}
