import { User } from '@prisma/client'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getWalletAssets } from '../repositories/user'

export const walletResolver: Resolvers['Wallet'] = {
  address: ({ walletAddress }) => walletAddress,
  tokens: async ({ walletAddress }) => {
    const assets = await getWalletAssets.load(walletAddress)
    return Object.values(assets).map(({ asset }) => asset)
  },
}

export const userResoler: Resolvers['User'] = {
  id: ({ id }) => id,
  walletAddress: ({ walletAddress }) => walletAddress,
  wallet: user => user,
  followedDaos: ({ id: userId }) => repositories.dao.findMany({ where: { UserDaoFollow: { some: { userId } } } }),
  avatarUrl: () => 'https://storage.googleapis.com/holdim-items/images/Frame%2043%20(1).png',
}

export const userQueryResolvers: Resolvers['Query'] = {
  me: (parent, args, context) => {
    return repositories.user.findUnique({ where: { id: context.user.uid } }) as Promise<User>
  },
}

export const userMutationResolvers: Resolvers['Mutation'] = {
  registerUser: async (parent, args, context) => {
    const assets = await getWalletAssets.load(args.walletAddress)
    let daosToFollow = await repositories.dao.findMany({ where: { Token: { some: { id: { in: Object.keys(assets).map(address => address.toLowerCase()) } } } } })

    if (!daosToFollow.length) {
      daosToFollow = await repositories.dao.findMany()
    }

    return repositories.user.upsert({
      select: { id: true, walletAddress: true, createdAt: true },
      where: { id: context.user.uid },
      create: { id: context.user.uid, walletAddress: args.walletAddress, UserDaoFollow: { createMany: { data: daosToFollow.map(dao => ({ daoId: dao.id })) } } },
      update: { walletAddress: args.walletAddress },
    })
  },
}
