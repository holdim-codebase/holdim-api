import { ApolloServer, AuthenticationError } from 'apollo-server'
import { logger, loggingPlugin } from './logging'
import { readFileSync, readdirSync } from 'fs'
import { resolvers } from './resolvers'
import path from 'path'
import { getFirebaseUser } from './services/firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import crypto from 'crypto'
import { Wallet } from '@prisma/client'
import { repositories } from './repositories'

export const server = new ApolloServer({
  typeDefs: [readFileSync('./gql-schema/pagination.gql').toString('utf-8'), readFileSync('./gql-schema/operations.gql').toString('utf-8'), ...readdirSync('./gql-schema/types').map(typePath => readFileSync(path.join('./gql-schema/types', typePath)).toString('utf-8'))],
  resolvers,
  logger,
  context: async ({ req }) => {
    let user: DecodedIdToken
    let wallet: Wallet|undefined
    try {
      user = await getFirebaseUser((req.headers.authorization ?? '').split('Bearer ')[1])
      if (typeof req.headers['wallet-id'] === 'string') {
        wallet = await repositories.wallet.findFirst({ where: { userId: user.uid, id: Number(req.headers['wallet-id']) } }) ?? undefined
      }
    } catch (error) {
      logger.debug(error, 'Auth failed')
      throw new AuthenticationError('Failed to authenticate')
    }

    return {
      wallet,
      user,
      requestId: crypto.randomUUID(),
    }
  },
  plugins: [
    loggingPlugin,
  ],
})
