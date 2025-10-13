//lib/utils/yoctoToDecimal()

export function yoctoToDecimal(str: string){
    const number = BigInt(str);
    const divisor = BigInt("1000000000000000000000000");
    return number/divisor;
}