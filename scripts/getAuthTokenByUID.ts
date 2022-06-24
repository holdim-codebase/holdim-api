import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'

initializeApp({
  apiKey: 'AIzaSyAUaG8Rzjjo66TOjpSBLx_YNJWb6hpHgzc',
})
const auth = getAuth()

const main = async () => {
  const user = await signInAnonymously(auth)

  console.log(user)
}

main()
  .then(() => console.log('Script Successfully completed'))
  .catch(error => console.error(error))
