import { Resolvers } from '../generated/graphql'
import { DaoResolver, daoQueryResolver, daoPersonalizedDataResolver, daoMutationResolver } from './dao'
import { PollResolver, proposalQueryResolvers, proposalResolver } from './proposal'
import { tokenPersonalizedDataResolver, tokenResolver } from './token'
import { userMutationResolvers, userQueryResolvers, userResolver } from './user'
import { walletMutationResolver, walletResolver } from './wallet'

export const resolvers: Resolvers = {
  User: userResolver,
  Proposal: proposalResolver,
  DAO: DaoResolver,
  DaoPersonalizedData: daoPersonalizedDataResolver,
  Token: tokenResolver,
  TokenPersonalizedData: tokenPersonalizedDataResolver,
  Wallet: walletResolver,
  ProposalPoll: PollResolver,

  Query: {
    ...userQueryResolvers,
    ...daoQueryResolver,
    ...proposalQueryResolvers,
  },

  Mutation: {
    ...userMutationResolvers,
    ...daoMutationResolver,
    ...walletMutationResolver,
  },
}
