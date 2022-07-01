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
  daos: () => {
    return repositories.dao.findMany()
  },
}
