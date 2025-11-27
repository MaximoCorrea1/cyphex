// lib/utils/yoctoToDecimal.ts

import { NEAR } from '@near-js/tokens'


export function yoctoToDecimal(yoctoAmount: string | number): number {
  // Convert to string if it's a number
  const yoctoStr = typeof yoctoAmount === 'number' 
    ? yoctoAmount.toFixed(0) 
    : yoctoAmount;
  
  // Handle empty or zero
  if (!yoctoStr || yoctoStr === "0") return 0;
  
  
  const decimal = NEAR.toDecimal(yoctoStr);
  
  
 
  
  return parseFloat(decimal);
}