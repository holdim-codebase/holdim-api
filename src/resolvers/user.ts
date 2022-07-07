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
  wallet: (user) => user,
}

export const userQueryResolvers: Resolvers['Query'] = {
  me: (parent, args, context) => {
    return repositories.user.findUnique({ where: { id: context.user.uid } }) as Promise<User>
  },
}

export const userMutationResolvers: Resolvers['Mutation'] = {
  registerUser: async (parent, args, context) => {
    return repositories.user.upsert({
      select: { id: true, walletAddress: true, createdAt: true },
      where: { id: context.user.uid },
      create: { id: context.user.uid, walletAddress: args.walletAddress },
      update: { walletAddress: args.walletAddress },
    })
  },
}
