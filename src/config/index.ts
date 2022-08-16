const requiredToBe = (value: any, type: 'string'|'number') => {
  // eslint-disable-next-line valid-typeof
  if (typeof value !== type) {
    throw new Error('Missing required configuration')
  }
  return value
}

export const config = {
  services: {
    alchemy: {
      apiKey: requiredToBe(process.env.ALCHEMY_API_KEY, 'string'),
    },
    zerion: {
      apiKey: requiredToBe(process.env.ZERION_API_KEY, 'string'),
      url: 'wss://api-v4.zerion.io/',
    },
    snapshot: {
      url: 'https://hub.snapshot.org/graphql',
    },
  },
  connectors: {
    redis: {
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD ?? 'local',
    },
  },
}
