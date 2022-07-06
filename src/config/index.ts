const requiredToBe = (value: any, type: 'string'|'number') => {
  // eslint-disable-next-line valid-typeof
  if (typeof value !== type) {
    throw new Error('Missing required configuration')
  }
  return value
}

export const config = {
  services: {
    zerion: {
      apiKey: requiredToBe(process.env.ZERION_API_KEY, 'string'),
      url: 'wss://api-v4.zerion.io/',
    },
  },
}
