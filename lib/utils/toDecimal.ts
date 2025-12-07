// chain-agnostic decimal conversion

export function toDecimal(amount: string, decimals: number): string {


  if (typeof amount != 'string') throw new Error('input is not a string');

  if (!amount || amount === "0") return "0";

  const isNegative = amount.startsWith('-');
  const absoluteAmount = isNegative ? amount.slice(1) : amount;

  //check if we need padding 10, 1
  let padded = absoluteAmount;

  if (absoluteAmount.length <= decimals) {
    padded = absoluteAmount.padStart(decimals + 1, '0');
  }

  const integerPart = padded.slice(0, padded.length - decimals);
  const decimalPart = padded.slice(padded.length - decimals, padded.length);

  //remove trailing zeros from decimal part
  const trimmedDecimalPart = decimalPart.replace(/0+$/, '');

  return integerPart + "." + trimmedDecimalPart;


}
