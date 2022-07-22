/**
 * @param tokenQuantity > 0 string integer
 * @param decimals >0 interger
 * @returns formatted token representation
 */
export const formatTokenWithDecimals = (tokenQuantity: string, decimals: number) => {
  if (Number(tokenQuantity) === 0) {
    return '0'
  }
  const paddedTokenQuantity = tokenQuantity.padStart(decimals, '0')
  const beforeDecimalPoint = paddedTokenQuantity.substring(0, paddedTokenQuantity.length - decimals) || '0'
  const afterDecimalPoint = tokenQuantity.padStart(decimals, '0').substring(tokenQuantity.length - decimals).replace(/0+$/, '')

  return `${beforeDecimalPoint}${afterDecimalPoint ? '.' : ''}${afterDecimalPoint}`
}
