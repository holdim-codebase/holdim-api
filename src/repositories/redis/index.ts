import Redis from 'ioredis'
import { config } from '../../config'

export const redis = new Redis({
  host: config.connectors.redis.host,
  password: config.connectors.redis.password,
  keepAlive: 1,
})

/**
 * Used for caching
 * @param key
 * @param getValue
 * @param ttl in seconds
 * @returns
 */
export const redisWrapper = async <T extends Record<string, any>>(key: string, getValue: () => Promise<T>, ttl?: number): Promise<T> => {
  const existingValue = await redis.get(key)
  if (!existingValue) {
    const value = await getValue()
    if (!ttl) {
      await redis.set(key, JSON.stringify(value))
      return value
    }
    await redis.set(key, JSON.stringify(value), 'EX', ttl)
    return value
  }

  return JSON.parse(existingValue)
}
