import { Resolvers } from '../generated/graphql'
import { DaoResolver, daoQueryResolver, daoPersonalizedDataResolver, daoMutationResolver } from './dao'
import { proposalQueryResolvers, proposalResolver } from './proposal'
import { tokenPersonlizedDataResolver, tokenResoler } from './token'
import { userMutationResolvers, userQueryResolvers, userResoler, walletResolver } from './user'

export const resolvers: Resolvers = {
  User: userResoler,
  Proposal: proposalResolver,
  DAO: DaoResolver,
  DaoPersonalizedData: daoPersonalizedDataResolver,
  Token: tokenResoler,
  TokenPersonalizedData: tokenPersonlizedDataResolver,
  Wallet: walletResolver,

  Query: {
    ...userQueryResolvers,
    ...daoQueryResolver,
    ...proposalQueryResolvers,
  },

  Mutation: {
    ...userMutationResolvers,
    ...daoMutationResolver,
  },
}
