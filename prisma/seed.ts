import { repositories } from '../src/repositories'
import { omit } from 'lodash'

const dao = {
  uniswap: {
    snapshotId: 'uniswap',
    name: 'Uniswap',
    logo: 'ipfs://QmdNntEZMnen3QE9GfHG4heeqMJkFjxQ9BDof4m8xzV6UT',
    overview: '<h>Sample text</h>\
<p>dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview </p>',
    tokenOverview: '<h>Sample text</h>\
<p>token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview </p>',
    tokens: [{
      id: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      name: 'UNI',
    }]
  },
  oneInch: {
    snapshotId: '1inch.eth',
    name: '1inch Network',
    logo: 'https://app.1inch.io/assets/favicon/apple-touch-icon.png',
    overview: '<h>Sample text</h>\
  <p>dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview dao overview </p>',
    tokenOverview: '<h>Sample text</h>\
  <p>token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview token overview </p>',
    tokens: [{
      id: '0x111111111117dc0aa78b770fa6a738034120c302',
      name: '1INCH',
    }, {
      id: '0xA0446D8804611944F1B527eCD37d7dcbE442caba',
      name: 'st1INCH',
    }, {
      id: '0x03d1B1A56708FA298198DD5e23651a29B76a16d2',
      name: 'v1INCH',
    }],
  },
}

const dataset = [{
  dao: dao.oneInch,
  snapshotId: '0x6358c27cd2d5a95e58095e5cc3b1b9a85d2c9af2a363b259431b53718b26dbb6',
  author: '0x824732D3F4Eb94a20254cca9DE10485Ce445Bb40',
  startAt: new Date(1651561423e3),
  endAt: new Date(1652166223e3),
  title: '[1IP-07] Integrate Balancer Boosted Pools in the 1inch Aggregation Protocol',
  juniorDescription: 'Test',
  middleDescription: 'Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test',
  seniorDescription: '## Simple Summary\n\nThis proposal calls for the integration of [Balancer Boosted Pools](https://docs.balancer.fi/products/balancer-pools/boosted-pools) into the 1inch Aggregation Protocol.\n\n## Abstract\n\nThis proposal aims to grow the kinds of liquidity sources compatible with the 1inch Aggregation Protocol by integrating Balancer Boosted Pools. To fund this development, a BAL grant from Balancer DAO and Balancer DAO will be awarded to 1inch Labs upon the successful completion of the integration. Specifically, the following\n\n1. 1inch Labs shall integrate the Balancer Boosted Pools into the 1inch smart contracts, the 1inch dApp, and the 1inch API.\n2. The integration shall be live on the Ethereum main-net no later than 3 weeks after this proposal passes the Phase-4 snapshot vote.\n3. If both conditions 1 and 2 are met, Balancer DAO and Balancer DAO will transfer 20k BAL or the equivalent in stablecoins (as determined by Balancer DAO) to 1inch Labs.\n\n## Motivation\n\nBalancer Boosted Pools are a new pool type that have been gaining traction from many DeFi protocols. These pools were previously discussed with the 1inch community on the [1inch Governance Forum](https://gov.1inch.io/t/1inch-balancer-boosted-pools/3012) as well as the [1inch Network DAO Community Call #02](https://youtu.be/OQF0wqgQXDg).\n\nGiven that this is a new pool type and requires effort from 1inch Labs, Balancer seeks to fund this integration via a payment of 20,000 BAL to 1inch Labs.\n\n## Specification\n\nAt a high level, integration of Balancer Boosted Pools would require support for Balancer’s BatchSwap function, the routing of trades through multiple Balancer pools including linear pools nested in the boosted pool and the math in the linear pools. This proposal hopes that the support for Boosted Pools is general and can later be expanded to new future Boosted Pools. The integration of Balancer’s BatchSwap function within the 1inch Network will also be able to be used for pools other than Boosted Pools which would benefit both the 1inch Network and Balancer as it would allow for cheaper execution of trades from the wider Balancer pool types. In the near future we expect to see meta pools created with the BPT of Boosted Pools, an example would be a bbaUSD/WETH pool. Routing trades through such pools would include one or more extra hop through Balancer’s BatchSwap function.\n\nWe expect that there will be many new Boosted Pools across all networks in near future, namely poos in collaboration with Ampleforth and Olympus although, below is a non-exhaustive list of currently live Boosted Pools on Ethereum L1:\n\n1. bbaUSD, containing 300mm of DAI/USDC/USDT TVL\n2. bbfUSD, [expected](https://tribe.fei.money/t/fip-90-fuse-boosted-usd-balancer-pool-bb-f-usd/4023) to contain at least 50mm of FEI/LUSD/DAI\n\nThis is contingent on the same proposal passing through the BalancerDAO.\n\nUpon satisfactory integration <sup>*Note1*</sup>, 20,000 BAL shall be sent to 1inch Labs ETH address:\n\n0x2DF104682A61241C79eBB3ce3b2C293578bF6A9D.\n\n*Note 1*: Satisfactory integration is defined as the 1inch Aggregation Protocol accurately forwarding trades through the bbaUSD and the bbfUSD pools, on Ethereum main-net, when those pools offer the optimal pricing for the end-user.\n\n## Rationale\n\nSupport for the mentioned pools will unlock $350mm of efficient TVL for the 1inch Aggregation Protocol and allow it to have access to cheap liquidity for trade routing at the moment of integration and much more TVL in the future as Boosted Pool continue their adoption. Additionally, Boosted Pools have been adapted by BeethovenX, Balancer’s Friendly Fork on Fantom and, integrating them would provide a good source for volume to 1inch on Fantom as well.\n\nBalancer Boosted Pools are in much demand from other DeFi protocols due to their innovation in capital efficiency thus, it is expected to see many more Balancer Boosted Pools with high TVL in collaboration with other DAOs, some of which were mentioned in the discussion on the forum. Supporting Boosted Pools will position the 1inch aggregator to be able to rapidly integrate any new Boosted Pools launched.\n\nThis BAL grant would be used by 1inch Labs to fund the development of this integration.\n\n## Considerations\n\nThe technical specifics of this integration will be defined by 1inch Labs. Like all new modules they have launched, a complete internal security review and audit should be performed before this change is implemented on main-net.\n\nBecause Balancer DAO is directly funding this integration, other upgrades to the 1inch Network can be made in parallel.',
  snapshotLink: 'https://snapshot.org/#/1inch.eth/proposal/0x6358c27cd2d5a95e58095e5cc3b1b9a85d2c9af2a363b259431b53718b26dbb6',
  discussionLink: 'https://gov.1inch.io/t/1ip-07-integrate-balancer-boosted-pools-in-the-1inch-aggregation-protocol/3096',
}, {
  dao: dao.oneInch,
  snapshotId: '0xf4f712189924944dfd1cb438dc3235f4f4d5493f8c9db4df2e64c4d421c1f2d0',
  author: '0x824732D3F4Eb94a20254cca9DE10485Ce445Bb40',
  endAt: new Date(1647368414e3),
  juniorDescription: 'Test',
  middleDescription: 'Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test',
  seniorDescription: '## Summary\n\n1inch Network was founded on core values of decentralization and open financial freedom, with a goal of improving the human condition for everyone on the planet. As one of the leading dApps in the DeFi space, it is in a unique position to extend additional assistance to people in a time of need.\n\nWith that said, this proposal seeks to donate 1 million USDC of 1inch DAO Treasury funds to support humanitarian aid within the country of Ukraine.\n\n## Abstract\n\nSince inception just over 3 months ago, the 1inch DAO Treasury has been highly successful in growing its total capital. It has accumulated close to 7 million USDC to date from a steady income stream of swap surplus funds. This proposal aims to donate 1 million USDC of these accumulated funds to provide critical humanitarian support within Ukraine’s conflict zone.\n\nSpecifically, these funds will be converted into USDT via 1inch v4 protocol, then transferred to the official wallet of Ukraine, as outlined [here](https://twitter.com/ukraine/status/1497594592438497282?s=21). These funds will then be distributed as needed to civilians for repairing infrastructure, supporting health facilities with medicine and equipment, and supporting families with food and hygiene items.\n\n## Motivation\n\n1inch Network is a global project which brings together extraordinary minds from all over the world. Both users and contributors alike are negatively affected by the recent war-time events unfolding this week, and it is the absolute duty of 1inch DAO to provide support to civilians within the conflict zone in every way possible.\n\n## Specification\n\n1. Swap 1,000,500 USDC to USDT within multi-sig on [1inch app](https://app.1inch.io/)\n2. Transfer 1,000,000 USDT from 1inch DAO Treasury multi-sig wallet to the official humanitarian wallet of Ukraine\n\n*Due to exchange rates, a slightly higher amount of USDC is required to receive 1,000,000 USDT when swapping*\n\n* 1inch DAO Treasury address: 0x7951c7ef839e26f63da87a42c9a87986507f1c07\n\n* Donation address: 0x165CD37b4C644C2921454429E7F9358d18A45e14\n\n## Rationale\n\nThis donation address has been [verified](https://twitter.com/TomicahTD/status/1497601610775769094) by the crypto community as legitimate, and has been identified as having a direct impact on the humanitarian crisis currently unfolding in Ukraine.\n\n## Considerations\n\nWith the 1inch DAO Treasury’s historical rate of growth, the donation amount of 1 million USDC will have minimal impact on the DAO’s ability to fund future developments of 1inch Network. At the same time, this amount will have a significant impact on the humanitarian relief efforts for Ukraine and its citizens.\n\nFor accountability, a screenshot and link to the transaction will be added to this proposal once the transfer of funds is complete.\n\n*****\n\n[Link to Phase-3 temperature check vote.](https://gov.1inch.io/t/1ip-06-donation-of-1inch-dao-treasury-funds-to-support-ukraine-s-humanitarian-crisis/2966)',
  startAt: new Date(1646763614e3),
  title: '[1IP-06] Donation of 1inch DAO Treasury Funds to support Ukraine’s humanitarian crisis ',
  snapshotLink: 'https://snapshot.org/#/1inch.eth/proposal/0xf4f712189924944dfd1cb438dc3235f4f4d5493f8c9db4df2e64c4d421c1f2d0',
  discussionLink: '',
}, {
  dao: dao.uniswap,
  snapshotId: '0x7f196c3444623a33ac147d1676d84e45d3c4c56a94baa85547b77d6fab82faab',
  author: '0x4C0a466DF0628FE8699051b3Ac6506653191cc21',
  startAt: new Date(1654183625e3),
  endAt: new Date(1654444800e3),
  juniorDescription: 'Test',
  middleDescription: 'Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test',
  seniorDescription: 'Authors: [Trent](https://twitter.com/trent_vanepps) (PG Member), [Tim](https://twitter.com/TimBeiko) (PG Member)\n\n### Abstract\n\nThis is a proposal for the Uniswap community to support important Ethereum Public Goods through the Protocol Guild: a vested split contract which goes to 110 core protocol contributors.\n\nWe propose that 500k UNI (~$2.5mm @ $5.19 UNI) be allocated to support the ongoing work of these core contributors in the initial Protocol Guild Pilot.\n\nParticipating in the 1 year Pilot allows guild members to engage with Uniswap in a way that is values- and incentive-aligned. Simultaneously, it will allow them to continue the important work of scaling our shared infrastructure and making it as resilient as possible for the applications on top of it.\n\n### Useful links\n\n* [Protocol Guild Docs](https://protocol-guild.readthedocs.io/en/latest/index.html#)\n* [1 Year Vesting Contract](https://app.0xsplits.xyz/accounts/0xF29Ff96aaEa6C9A1fBa851f74737f3c069d4f1a9/)\n* [Initial Announcement - Dec 2021](https://stateful.mirror.xyz/mEDvFXGCKdDhR-N320KRtsq60Y2OPk8rHcHBCFVryXY)\n* [List of Members](https://protocol-guild.readthedocs.io/en/latest/9-membership.html)\n* [PG twitter account](https://twitter.com/ProtocolGuild)\n\n### Context\n\n1. As a credibly neutral, maximally uncapturable infrastructure with no block reward, the Ethereum base protocol doesn’t offer the same token incentives to contributors as applications or L2s can. However, the protocol still needs to attract and retain talent to continue to evolve. As the broader ecosystem continues to grow, competition for talented individuals will only increase. This isn’t to fault individuals for rationally weighting financial incentives, or protocols for leveraging the power of tokens - this is just the reality of the current context. We also acknowledge that financial motivations aren’t the only or best motivator for people, it’s just one tool in our toolset that is currently underleveraged.\n2. Existing public goods funding solutions tend to be either too narrow or broad in scope, fail to exclusively target core protocol contributors, or depend on an intermediating institution, which often leads to organizations, and not individuals, being recipients of funds.\n3. The Protocol benefits from contributor continuity. Transferring institutional knowledge between cohorts is more likely to happen successfully the more overlap there is.\n\nHere’s a longer exploration of the [project rationale](https://protocol-guild.readthedocs.io/en/latest/1-proposal-rationale.html).\n\nIf we believe what we are building is important, then we should structure the incentives to attract more smart people to work on it. After all - “Ethereum is an unprecedented arena for playing cooperative games”; we should try to manifest the novel possibilities made possible by this arena. ([Griffith, 2019](https://medium.com/@virgilgr/ethereum-is-game-changing-technology-literally-d67e01a01cf8))\n\n### What is the Protocol Guild?\n\nThe Protocol Guild aims to address the challenges mentioned above with a simple tool: a weighted split contract that includes vesting. Members will solicit sponsorships in the form of tokens from applications & protocols that build on Ethereum, which gives core contributors exposure to success at the application layer:\n\n* current contributors are rewarded for past work through [time-based weighting](https://protocol-guild.readthedocs.io/en/latest/6-guidelines-for-regular-operation.html#weighting)\n* current contributors contribute for longer periods, resulting in less contributor churn, better institutional knowledge transfer, and more stable core infrastructure\n* new contributors are incentivized to join core protocol work, protocol evolution and maintenance is more robust\n\nTo date, the membership includes over 110 Ethereum protocol contributors, including researchers, client maintainers, upgrade coordinators, and more, all self-curated (member list [here](https://protocol-guild.readthedocs.io/en/latest/9-membership.html)). This is a broad-based ecosystem effort: members come from 22 different teams and 9 organizations. Only 30% of members are directly employed by the EF. The membership is continuously curated and there are quarterly updates to the split contract.\n\nThe Guild contracts will act as an autonomous value routing mechanism, operated independently from any existing institution, purpose-built for incentivizing long-term core protocol work. At no point does PG take custody of funds on behalf of members, it is all handled trustlessly. The diagram below and the [docs](https://protocol-guild.readthedocs.io/en/latest/3-smart-contract.html) have more information.\n\n \n![0xsplits horizontal.png](ipfs://QmdpmizBcNGuVV5FZR4zLUz3wsYTTdfNpVZsywMC7Utpdo)\n    \n\n### PG Pilot\n\nSince starting the project in Nov 2021, we’ve built norms around member onboarding, refined the splitting and vesting mechanisms, and have created extensive documentation on how PG operates. At this point, we’re ready to test the mechanism’s efficacy with a 1 year / $10-20mm Pilot. We want to make sure the mechanism operates smoothly before graduating to a larger round with longer vesting periods. We are currently outreaching to 5-10 prominent Ethereum-based projects to get commitments for this important first milestone. We want to ensure there is a healthy diversity of contributing protocols both in terms of USD value as well as domain (eg. DeFi, staking, etc). The first commitment is from Lido to contribute [2,000,000 LDO](https://research.lido.fi/t/proposal-to-fund-the-protocol-guild-pilot-via-a-lido-grant/2016/1), and the [vote](https://snapshot.org/#/ens.eth/proposal/0xe07284156fb063d5fba6b9fed50cc74fad36ea02c2ede0207434db476884104b) ([forum post](https://discuss.ens.domains/t/ep13-executable-support-the-protocol-guild-pilot/12877/50)) to contribute 200k ENS will conclude in the next few days.\n\nThe funds for the Pilot would be vested directly to Guild members over one year: see the [Pilot vesting contract here](https://app.0xsplits.xyz/accounts/0xF29Ff96aaEa6C9A1fBa851f74737f3c069d4f1a9/). Note that funds would not replace salaries for core contributors, and each recipient would be making an independent decision about how to use their tokens once vested.\n\n### Proposal\n\nWe are inviting the Uniswap community to be part of this inaugural Pilot in the form of a 500k UNI transfer to the Protocol Guild’s vesting contract. We think this is an appropriate amount which balances between the current size of the treasury ([$1.2b as of May 16, 2022](https://openorgs.info/)), the number of beneficiaries, and the scope and intent of the Pilot.\n\nThere are a few reasons why supporting the Protocol Guild benefits the Uniswap community:\n\n* Uniswap’s long-term success is tightly coupled with the continued evolution and maintenance of the Ethereum protocol. These are projects that often have multi-year timelines. Contributing to the Pilot meaningfully increases the incentive to contribute to the core protocol, including:\n  * [The Merge](https://github.com/ethereum/pm/blob/master/Merge/mainnet-readiness.md): moving from PoW to PoS, increasing security and sustainability\n  * EVM improvements: new functionality for developers like [EOF](https://notes.ethereum.org/@ipsilon/evm-object-format-overview)\n  * [Statelessness](https://notes.ethereum.org/@gballet/Sy-a6T5St): sustainable management for state growth\n  * Supporting L2 scaling: [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), [EIP-4488](https://eips.ethereum.org/EIPS/eip-4488)\n  * [Proposer Builder Separation](https://notes.ethereum.org/@vbuterin/pbs_censorship_resistance): reducing centralizing incentives for consensus participants\n  * Continuous client maintenance: improving sync, exploring new database types, researching modular clients\n  * Coordinating network upgrades: making sure the community helps to shape and is aware of network upgrades\n* Having exposure to UNI allows protocol contributors to engage more with Uniswap governance. Members will be encouraged (but not obligated) to use the vested tokens in their respective governance framework.\n* Uniswap should be among the protocols maximally aligned with the Public Goods of the largest ecosystem it operates in. Pilot participation maintains and expands the Uniswap community’s existing reputation for funding Public Goods.\n* Diverse funding sources from the community further decentralizes protocol governance and prevents influence from pooling with any single entity.\n\n### Next Steps\n\nIf this Temp Check Snapshot vote has a positive outcome, we will move to a consensus check, and then an onchain vote.',
  title: '[Temperature Check] Should the Uniswap community participate in the Protocol Guild Pilot?',
  snapshotLink: 'https://snapshot.org/#/uniswap/proposal/0x7f196c3444623a33ac147d1676d84e45d3c4c56a94baa85547b77d6fab82faab',
  discussionLink: 'https://gov.uniswap.org/t/temperature-check-should-the-uniswap-community-participate-in-the-protocol-guild-pilot/16904',
}]

const main = async () => {
  const forceUpsert = process.env.SEED_FORCE_UPSERT
  if (!forceUpsert) {
    const existingProposals = await repositories.proposal.findMany({ take: 1 })

    if (existingProposals.length) {
      return
    }
  }

  await Promise.all(dataset.map(async (propData) => {
    const { tokens, ...dao } = propData.dao
    const { id: daoId } = await repositories.dao.upsert({
      select: { id: true },
      where: { snapshotId: propData.dao.snapshotId },
      create: dao,
      update: dao,
    })
    await Promise.all(
      tokens.map(token => repositories.token.upsert({
        where: { id: token.id },
        create: { ...token, daoId },
        update: { ...token, daoId },
      }))
    )

    await repositories.proposal.upsert({
      where: { snapshotId: propData.snapshotId },
      create: { ...omit(propData, 'dao'), daoId },
      update: omit(propData, 'dao'),
    })
  }))
}

main()
  .then((() => console.info('Successfully seeded 💦')))
  .catch(error => console.error(error))