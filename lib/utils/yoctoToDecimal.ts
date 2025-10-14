//lib/utils/yoctoToDecimal()

export function yoctoToDecimal(str: string){

    if(!str || str === "0") return 0;
    
    let numberStr = str;
    
    numberStr = numberStr.padStart(25, "0");

    numberStr = numberStr.slice(0, -24) + "." + numberStr.slice(-24);

    console.log(numberStr);

    


    return parseFloat(numberStr);
}