import { ApolloServer, AuthenticationError } from 'apollo-server'
import { logger } from './logging'
import { readFileSync, readdirSync } from 'fs'
import { resolvers } from './resolvers'
import path from 'path'
import { getFirebaseUser } from './services/firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export const server = new ApolloServer({
  typeDefs: [readFileSync('./gql-schema/operations.gql').toString('utf-8'), ...readdirSync('./gql-schema/types').map(typePath => readFileSync(path.join('./gql-schema/types', typePath)).toString('utf-8'))],
  resolvers,
  logger,
  context: async ({ req }) => {
    let user: DecodedIdToken
    try {
      user = await getFirebaseUser((req.headers.authorization ?? '').split('Bearer ')[1])
    } catch (error) {
      logger.debug({ error }, 'Auth failed')
      throw new AuthenticationError('Failed to authenticate')
    }

    return {
      user,
    }
  },
})
