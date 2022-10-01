import { Proposal } from '@prisma/client'
import axios from 'axios'
import DataLoader from 'dataloader'
import { config } from '../config'
import { logger } from '../logging'
import { redisWrapper } from '../repositories/redis'
import { DATALOADER_PARAMS } from '../repositories/redis/keys'

export interface ProposalVotes {
  id: string
  scores: number[]
  choices: string[]
  symbol: string
  scores_total: number
  votes: number
  quorum: number
}

const getProposalVotes = async (proposalSnapshotId: Proposal['snapshotId']): Promise<ProposalVotes> => {
  logger.info({ message: 'Requesting proposal votes from Snapshot', proposalSnapshotId })
  const response = await axios.post(config.services.snapshot.url, {
    query: `
      query proposalVotes($id: String!) {
        proposals(where: {id: $id}) {
          id
          scores
          choices
          symbol
          scores_total
          votes
          quorum
        }
      }
    `,
    variables: {
      id: proposalSnapshotId,
    },
  })

  logger.info({ message: 'Response from Snapshot', proposalSnapshotId, response })

  return response.data.data.proposals[0]
}

export const snapshotVotesDataloader = new DataLoader<Proposal['snapshotId'], ProposalVotes|undefined>(proposalSnapshotIds => {
  return Promise.all(proposalSnapshotIds.map(async proposalSnapshotId => {
    try {
      return (await redisWrapper(DATALOADER_PARAMS.proposalVotes.keyGen(proposalSnapshotId), getProposalVotes.bind(null, proposalSnapshotId), DATALOADER_PARAMS.proposalVotes.ttl))
    } catch (error) {
      logger.error({ tokenId: proposalSnapshotId, message: 'Request for snapshot proposal failed' })
      return new Error('Failed to get proposal info')
    }
  }))
})
