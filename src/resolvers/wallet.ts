import { ApolloError } from 'apollo-server'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getWalletAssets } from '../repositories/user'
import { processNewWallet } from '../utils/wallet'

export const walletResolver: Resolvers['Wallet'] = {
  id: ({ id }) => id.toString(),
  address: ({ address }) => address,
  ens: ({ ens }) => ens,
  tokens: async ({ address }) => {
    const assets = await getWalletAssets.load(address)
    return Object.values(assets).map(({ asset }) => asset)
  },
}

export const walletMutationResolver: Resolvers['Mutation'] = {
  addWallet: async (parent, { walletAddress }, ctx) => {
    if (!ctx.user) {
      throw new ApolloError('Must be user')
    }

    const { hexAddress, ens, daosToFollow } = await processNewWallet(walletAddress)

    return repositories.wallet.create({
      data: {
        userId: ctx.user.uid,
        address: hexAddress,
        ens,
        WalletDaoFollow: { createMany: { data: daosToFollow.map(dao => ({ daoId: dao.id })) } },
      },
    })
  },
  deleteWallet: async (parent, args, ctx) => {
    if (!ctx.wallet) {
      throw new ApolloError('Missing wallet')
    }

    await repositories.wallet.delete({ where: { id: ctx.wallet.id } })

    return ctx.wallet
  },
}
