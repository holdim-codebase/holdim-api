import { ApolloServer } from 'apollo-server'
import { logger } from './logging'
import { readFileSync, readdirSync } from 'fs'
import { resolvers } from './resolvers'
import path from 'path'
import { getFirebaseUser } from './services/firebase'

export const server = new ApolloServer({
  typeDefs: [readFileSync('./gql-schema/operations.gql').toString('utf-8'), ...readdirSync('./gql-schema/types').map(typePath => readFileSync(path.join('./gql-schema/types', typePath)).toString('utf-8'))],
  resolvers,
  logger,
  context: async ({ req }) => {
    return {
      // user: await getFirebaseUser((req.headers.authorization ?? '').split('Bearer ')[1]),
    }
  },
})
