// chain-agnostic decimal conversion

export function toDecimal(amount: string | number, decimals: number): number{

  //normalize input to str
  const amountStr = typeof amount === 'number' ? amount.toFixed(0) : amount;

  if(!amountStr || amountStr === "0") return 0;

  const isNegative = amountStr.startsWith('-');
  const absoluteAmount = isNegative ? amountStr.slice(1) : amountStr;

  const padded = absoluteAmount.padStart(decimals + 1, '0');

  const integerPart = padded.slice(0, )
}
