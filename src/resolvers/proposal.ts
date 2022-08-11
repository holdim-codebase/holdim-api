import { Dao } from '@prisma/client'
import { isUndefined, omitBy } from 'lodash'
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
  proposals: async (parent, { onlyFollowedDaos, daoIds }, ctx) => {
    return repositories.proposal.findMany({
      orderBy: { startAt: 'desc' },
      where: {
        dao: omitBy({
            id: daoIds ? { in: daoIds.map(Number) } : undefined,
            UserDaoFollow: onlyFollowedDaos ? { some: { userId: ctx.user.uid } } : undefined,
          }, isUndefined),
      },
    })
  },
}
