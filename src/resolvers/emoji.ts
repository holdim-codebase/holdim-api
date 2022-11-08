import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'

export const emojiResolver: Resolvers['Emoji'] = {
  id: ({ id }) => id.toString(),
  url: ({ url }) => url,
  unicode: ({ unicode }) => unicode,
}

export const emojiQueryResolvers: Resolvers['Query'] = {
  emojis: async () => {
    return repositories.emoji.findMany({ orderBy: { id: 'asc' } })
  },
}

export const emojiMutationResolvers: Resolvers['Mutation'] = {
  changeProposalEmoji: async (parent, { proposalId, emojiId }, ctx) => {
    const existingReaction = await repositories.userProposalEmoji.findUnique({ where: { proposalId_userId: { proposalId: Number(proposalId), userId: ctx.user.uid } } })

    if (existingReaction) {
      await repositories.userProposalEmoji.delete({ where: { proposalId_userId: { proposalId: Number(proposalId), userId: ctx.user.uid } } })
    }

    if (existingReaction?.emojiId !== Number(emojiId)) {
      await repositories.userProposalEmoji.create({ data: { proposalId: Number(proposalId), userId: ctx.user.uid, emojiId: Number(emojiId) } })
    }

    return (await repositories.proposal.findUnique({ where: { id: Number(proposalId) } }))!
  },
}
