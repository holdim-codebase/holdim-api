import { User } from '.prisma/client'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'

export const userResoler: Resolvers['User'] = {
  id: ({ id }) => id,
  publicId: ({ publicId }) => publicId,
}

export const userQueryResolvers: Resolvers['Query'] = {}

export const userMutationResolvers: Resolvers['Mutation'] = {
  registerUser: (parent, args, context, info) => {
    const user = repositories.user.upsert({
      select: { id: true, publicId: true, createdAt: true },
      where: { id: '' },
      create: { id: '', publicId: args.publicId },
      update: { publicId: args.publicId },
    })

    return user
  },
}
