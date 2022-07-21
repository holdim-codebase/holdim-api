/**
 * @param tokenQuantity > 0 string integer
 * @param decimals >0 interger
 * @returns formatted token representation
 */
export const formatTokenWithDecimals = (tokenQuantity: string, decimals: number) => {
  if (Number(tokenQuantity) === 0) {
    return '0'
  }

  return `${tokenQuantity.padStart(decimals, '0').substring(0, tokenQuantity.padStart(decimals, '0').length - decimals) || '0'}.${tokenQuantity.padStart(decimals, '0').substring(tokenQuantity.length - decimals)}`
}
