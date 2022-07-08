import { Dao } from '@prisma/client'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'

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
}

export const proposalQueryResolvers: Resolvers['Query'] = {
  proposals: (parent, { onlyFollowedDaos }, ctx) => {
    const query: Parameters<typeof repositories['proposal']['findMany']>[0] = {}
    if (onlyFollowedDaos) {
      query.where = { dao: { UserDaoFollow: { some: { userId: ctx.user.uid } } } }
    }
    return repositories.proposal.findMany(query)
  },
}
