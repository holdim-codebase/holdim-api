import { Resolvers } from '../generated/graphql'
import { DaoResolver, daoQueryResolver } from './dao'
import { proposalQueryResolvers, proposalResolver } from './proposal'
import { userMutationResolvers, userResoler } from './user'

export const resolvers: Resolvers = {
  User: userResoler,
  Proposal: proposalResolver,
  DAO: DaoResolver,

  Query: {
    ...daoQueryResolver,
    ...proposalQueryResolvers,
  },

  Mutation: {
    ...userMutationResolvers,
  },
}
