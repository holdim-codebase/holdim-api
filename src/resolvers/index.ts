import { Resolvers } from '../generated/graphql'
import { DaoResolver } from './dao'
import { proposalQueryResolvers, proposalResolver } from './proposal'
import { userMutationResolvers, userResoler } from './user'

export const resolvers: Resolvers = {
  User: userResoler,
  Proposal: proposalResolver,
  DAO: DaoResolver,

  Query: {
    ...proposalQueryResolvers,
  },

  Mutation: {
    ...userMutationResolvers,
  },
}
