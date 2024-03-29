import { Dao } from '@prisma/client'
import { ApolloError } from 'apollo-server'
import { isUndefined, omitBy } from 'lodash'
import { Resolvers, ResolversTypes } from '../generated/graphql'
import { repositories } from '../repositories'
import { snapshotVotesDataloader } from '../services/snapshot'
import { paginatedResult } from '../utils/pagination'

export const ProposalPersonalizedDataResolver: Resolvers['ProposalPersonalizedData'] = {
  pickedEmojiId: async ({ id }, args, ctx) => {
    if (!ctx.user) {
      throw new ApolloError('Must be user')
    }

    const reaction = await repositories.userProposalEmoji.findUnique({ where: { proposalId_userId: { proposalId: id, userId: ctx.user.uid } } })
    if (reaction) {
      const emoji = await repositories.emoji.findUnique({ where: { id: reaction.emojiId } })
      return emoji?.id.toString() || null
    }

    return null
  },
}

export const ProposalStatisticDataResolver: Resolvers['ProposalStatisticData'] = {
  emojiCount: async ({ id }) => {
    return Promise.all(
      (await repositories.emoji.findMany()).map(async emoji => ({
        emojiId: emoji.id.toString(),
        count: await repositories.userProposalEmoji.count({ where: { proposalId: id, emojiId: emoji.id } }) ?? 0,
      }))
    )
  },
}

export const PollResolver: Resolvers['ProposalPoll'] = {
  scores: async ({ snapshotId }) => {
    const proposalVotes = await snapshotVotesDataloader.load(snapshotId)
    return proposalVotes?.scores ?? null
  },
  choices: async ({ snapshotId }) => {
    const proposalVotes = await snapshotVotesDataloader.load(snapshotId)
    return proposalVotes?.choices ?? []
  },
  symbol: async ({ snapshotId }) => {
    const proposalVotes = await snapshotVotesDataloader.load(snapshotId)
    return proposalVotes?.symbol ?? 'unknown'
  },
  scores_total: async ({ snapshotId }) => {
    const proposalVotes = await snapshotVotesDataloader.load(snapshotId)
    return proposalVotes?.scores_total ?? null
  },
  votes: async ({ snapshotId }) => {
    const proposalVotes = await snapshotVotesDataloader.load(snapshotId)
    return proposalVotes?.votes ?? null
  },
  quorum: async ({ snapshotId }) => {
    const proposalVotes = await snapshotVotesDataloader.load(snapshotId)
    return proposalVotes?.quorum ?? 0
  },
}

export const proposalResolver: Resolvers['Proposal'] = {
  id: ({ id }) => id.toString(),
  dao: ({ daoId }) => repositories.dao.findUnique({ where: { id: daoId } }) as Promise<Dao>,
  author: ({ author }) => author,
  startAt: ({ startAt }) => startAt.toString(),
  endAt: ({ endAt }) => endAt.toString(),
  juniorDescription: ({ juniorDescription }) => juniorDescription!,
  middleDescription: ({ middleDescription }) => middleDescription!,
  seniorDescription: ({ seniorDescription }) => seniorDescription,
  title: ({ title }) => title,
  snapshotLink: ({ snapshotLink }) => snapshotLink,
  discussionLink: ({ discussionLink }) => discussionLink,

  personalizedData: (proposal, _, ctx) => {
    if (ctx.organization) { return null }
    return proposal
  },
  statisticData: (proposal, _, ctx) => {
    if (ctx.organization) { return null }
    return proposal
  },
  poll: (proposal, _, ctx) => {
    if (ctx.organization) { return null }
    return proposal
  },
}

export const proposalQueryResolvers: Resolvers['Query'] = {
  proposals: async (parent, { onlyFollowedDaos, daoIds, ids }, ctx) => {
    return repositories.proposal.findMany({
      orderBy: { startAt: 'desc' },
      take: 10,
      where: {
        id: ids ? { in: ids.map(Number) } : undefined,
        dao: omitBy({
            id: daoIds ? { in: daoIds.map(Number) } : undefined,
            UserDaoFollow: (onlyFollowedDaos && ctx.user) ? { some: { userId: ctx.user.uid } } : undefined,
          }, isUndefined),
      },
    })
  },
  proposalsV2: async (parent, { onlyFollowedDaos, daoIds, first, after, ids, snapshotIds }, ctx) => {
    if (ctx.organization) {
      onlyFollowedDaos = false
    }
    if (!ctx.organization && !ctx.wallet?.id) {
      throw new ApolloError('Missing wallet')
    }

    return paginatedResult(
      repositories.proposal,
      {
        AND: [{
          id: ids ? { in: ids.map(Number) } : undefined,
          dao: omitBy({
              id: daoIds ? { in: daoIds.map(Number) } : undefined,
              WalletDaoFollow: onlyFollowedDaos ? { some: { walletId: ctx.wallet!.id } } : undefined,
            }, isUndefined),
          snapshotId: snapshotIds ? { in: snapshotIds } : undefined,
        }, {
          NOT: { issueNumber: null },
        }],
      },
      { issueNumber: 'desc' },
      first ?? undefined,
      after ?? undefined
    ) as ResolversTypes['ProposalConnection']
  },
}
