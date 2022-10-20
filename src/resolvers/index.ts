import { Resolvers } from '../generated/graphql'
import { DaoResolver, daoQueryResolver, daoPersonalizedDataResolver, daoMutationResolver } from './dao'
import { emojiMutationResolvers, emojiQueryResolvers, emojiResolver } from './emoji'
import { PollResolver as pollResolver, ProposalPersonalizedDataResolver, proposalQueryResolvers, proposalResolver, ProposalStatisticDataResolver } from './proposal'
import { tokenPersonalizedDataResolver, tokenResolver } from './token'
import { userMutationResolvers, userQueryResolvers, userResolver } from './user'
import { walletMutationResolver, walletResolver } from './wallet'

export const resolvers: Resolvers = {
  User: userResolver,
  Proposal: proposalResolver,
  ProposalPersonalizedData: ProposalPersonalizedDataResolver,
  ProposalStatisticData: ProposalStatisticDataResolver,
  DAO: DaoResolver,
  DaoPersonalizedData: daoPersonalizedDataResolver,
  Token: tokenResolver,
  TokenPersonalizedData: tokenPersonalizedDataResolver,
  Wallet: walletResolver,
  ProposalPoll: pollResolver,
  Emoji: emojiResolver,

  Query: {
    ...emojiQueryResolvers,
    ...userQueryResolvers,
    ...daoQueryResolver,
    ...proposalQueryResolvers,
  },

  Mutation: {
    ...emojiMutationResolvers,
    ...userMutationResolvers,
    ...daoMutationResolver,
    ...walletMutationResolver,
  },
}
