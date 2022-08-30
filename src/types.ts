import { Wallet } from '@prisma/client'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export interface Context {
  wallet?: Wallet
  user: DecodedIdToken
  requestId: string
}
