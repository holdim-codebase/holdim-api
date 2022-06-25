import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'

export const userResoler: Resolvers['User'] = {
  id: ({ id }) => id,
  walletAddress: ({ walletAddress }) => walletAddress,
}

export const userQueryResolvers: Resolvers['Query'] = {}

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
