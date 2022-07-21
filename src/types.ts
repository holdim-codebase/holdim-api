import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export interface Context {
  user: DecodedIdToken
  requestId: string
}
