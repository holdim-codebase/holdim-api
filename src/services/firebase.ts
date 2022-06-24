import admin from 'firebase-admin'

export const firebaseAdmin = admin.initializeApp()

export const getFirebaseUser = (accessToken: string) => {
  return firebaseAdmin.auth().verifyIdToken(accessToken)
}
