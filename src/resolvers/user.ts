import { User, Wallet } from '@prisma/client'
import { Resolvers } from '../generated/graphql'
import { repositories } from '../repositories'
import { getWalletAssets } from '../repositories/user'
import { processWalletAddress } from '../services/blockchain'
import { filterAssetsByPrice } from '../services/zerion/utils'

export const walletResolver: Resolvers['Wallet'] = {
  id: ({ id }) => id.toString(),
  address: ({ address }) => address,
  ens: ({ ens }) => ens,
  tokens: async ({ address }) => {
    const assets = await getWalletAssets.load(address)
    return Object.values(assets).map(({ asset }) => asset)
  },
}

export const userResolver: Resolvers['User'] = {
  id: ({ id }) => id,
  walletAddress: async (user) => (await repositories.wallet.findFirst({ where: { userId: user.id } }))?.address ?? '',
  wallet: user => repositories.wallet.findFirst({ where: { userId: user.id } }) as Promise<Wallet>,
  wallets: user => repositories.wallet.findMany({ where: { userId: user.id } }),
  followedDaos: ({ id: userId }) => repositories.dao.findMany({ where: { UserDaoFollow: { some: { userId } } } }),
  avatarUrl: () => 'https://storage.googleapis.com/holdim-items/images/Frame%2043%20(1).png',
}

export const userQueryResolvers: Resolvers['Query'] = {
  me: (parent, args, context) => {
    return repositories.user.findUnique({ where: { id: context.user.uid } }) as Promise<User>
  },
}

export const userMutationResolvers: Resolvers['Mutation'] = {
  registerUser: async (parent, args, context) => {
    const { hexAddress, ens } = await processWalletAddress(args.walletAddress)
    const assets = filterAssetsByPrice(await getWalletAssets.load(hexAddress))
    let daosToFollow = await repositories.dao.findMany({ where: { Token: { some: { id: { in: Object.keys(assets).map(address => address.toLowerCase()) } } } } })

    if (!daosToFollow.length) {
      daosToFollow = await repositories.dao.findMany()
    }

    return repositories.user.create({
      data: {
        id: context.user.uid,
        Wallet: { create: { address: hexAddress, ens } },
        UserDaoFollow: { createMany: { data: daosToFollow.map(dao => ({ daoId: dao.id })) } },
      },
    })
  },
}
