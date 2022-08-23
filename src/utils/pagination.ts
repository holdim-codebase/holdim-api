import { ApolloError } from 'apollo-server'
import { min } from 'lodash'

export const paginatedResult = async <T extends Record<string, any>>(
  repository: T,
  whereQuery: Record<string, any>,
  orderBy: Record<string, any>,
  first?: number, after?: string
): Promise<Record<string, any>> => {
  const toBase64 = (str: string) => Buffer.from(str).toString('base64')
  const fromBase64 = (str: string) => Buffer.from(str, 'base64').toString()

  const take = min([first ?? 10, 20]) as number + 1
  if (take === 0) { throw new ApolloError('Parameter `first` cannot be 0') }

  const items = await repository.findMany({
    take,
    cursor: after ? { id: Number(fromBase64(after)) } : undefined,
    orderBy,
    skip: after ? 1 : undefined,
    where: whereQuery,
  })

  if (!items.length) {
    return {
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
      edges: [],
    }
  }

  let hasNextPage = false
  if (items.length === take) {
    hasNextPage = true
    items.pop()
  }

  return {
    totalCount: await repository.count({ where: whereQuery }),
    pageInfo: {
      hasNextPage,
      endCursor: toBase64(items[items.length - 1].id.toString()),
    },
    edges: items.map((item: Record<string, any>) => ({ cursor: toBase64(item.id.toString()), node: item })),
  }
}
