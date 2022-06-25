import { program } from 'commander'
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'

initializeApp({
  apiKey: 'AIzaSyAUaG8Rzjjo66TOjpSBLx_YNJWb6hpHgzc',
})
const auth = getAuth()

const receiver = async () => {
  console.info('Welcome 👋')
  const user = await signInAnonymously(auth)
  console.info(`Here's your token:\n${await user.user.getIdToken()}\n`)
  console.info('Bye 👋')
}

program.action(receiver)
program.parse(process.argv)
