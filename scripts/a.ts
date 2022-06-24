import admin from 'firebase-admin'

admin.initializeApp()

admin.auth().listUsers().then(console.log)
