import { Resolvers } from '../generated/graphql'
import { userMutationResolvers, userResoler } from './user'

export const resolvers: Resolvers = {
  User: userResoler,

  Mutation: {
    ...userMutationResolvers,
  }
}
