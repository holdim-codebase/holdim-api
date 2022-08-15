export const DATALOADER_PARAMS = {
  proposalVotes: {
    keyGen: (proposalSnapshotId: string) => `proposal_votes:${proposalSnapshotId}`,
    ttl: 60 * 60,
  },
  walletAssets: {
    keyGen: (walletAddress: string) => `wallet:${walletAddress}`,
    ttl: 60,
  },
  tokenInfo: {
    keyGen: (tokenId: string) => `token:${tokenId}`,
    ttl: 60 * 60,
  },
}
