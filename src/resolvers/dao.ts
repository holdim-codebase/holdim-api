import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'

export const DaoResolver: Resolvers['DAO'] = {
  id: ({ id }) => id.toString(),
  logo: ({ logo }) => logo,
  name: ({ name }) => name,
  overviewHtml: ({ overviewHtml }) => overviewHtml,
  tokenOverviewHtml: ({ tokenOverviewHtml }) => tokenOverviewHtml,
}

export const daoQueryResolver: Resolvers['Query'] = {
  daos: (parent, { ids }) => {
    const whereQuery: Parameters<typeof repositories['dao']['findMany']>[0] = ids ? { where: { id: { in: ids.map(id => parseInt(id)) }} } : {}
    return repositories.dao.findMany(whereQuery)
  },
}
