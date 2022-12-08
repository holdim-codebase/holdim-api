import axios from 'axios'
import { repositories } from '../src/repositories'

const SEC_IN_MS = 1e3
const MIN_IN_MS = SEC_IN_MS * 60
const HOUR_IN_MS = MIN_IN_MS * 60
const DAY_IN_MS = HOUR_IN_MS * 24

const SNAPSHOT_BASE_URL = 'https://hub.snapshot.org/graphql'

const removeDeleted = async (from: Date) => {
  const proposals = await repositories.proposal.findMany({
    where: {
      createdAt: { gte: from },
    },
  })

  for (const proposal of proposals) {
    try {
      // Time delay is set to avoid HTTP 429 status from snapshot server
      await new Promise(resolve => setTimeout(resolve, 1e3))

      const { data } = await axios.post(SNAPSHOT_BASE_URL, {
        operationName: 'Proposal',
        variables: { id: proposal.snapshotId },
        query: 'query Proposal($id: String!) {\n  proposal(id: $id) {id}}',
      })

      console.log({ data, id: proposal.id })
      if (!data) {
        await repositories.proposal.delete({ where: { id: proposal.id } })
      }
    } catch (error) {
      console.log(`error: ${(error as Error).message}, proposal: ${JSON.stringify(proposal.id)}`)
    }
  }
}

removeDeleted(new Date(Date.now() - DAY_IN_MS))
  .then(() => console.log('Successfully finished'))
  .catch((error: Error) => console.error(`Script failed, error: ${error.message}`))
