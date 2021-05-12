const inputBit = document.getElementById('input-bit');
// get the input element for bits

const resultBit = document.getElementById('result-dec');
// where to display converted bits as decimal

const isZeroOne = (e) => {
    const key = e.key;
    // what key was pressed
    if (key !== '0' && key !== '1' && key !== 'backspace' && key.includes('arrow')) {
        console.log('not 0 & not 1')
        return false;
    }
}

const transformString = (string) => {
    let bits = string.split('');
    console.log('bits', bits, typeof bits);
    // create array from characters of that string

    bits = bits.filter(b => b !== ' ');
    console.log('filtered bits', bits, typeof bits);
    // filter out potential spaces

    bits = bits.map(b => parseInt(b));
    console.log('mapped bits', bits, typeof bits);
    // turn string entries into integers

    return bits;
}

const getDec = (array) => {
    const l = array.length;

    let m = 1;
    // initial multiplier for bit position (1 -> 2 -> 4 -> 8 -> 16 ...)

    let dec = 0;
    // store the result

    for (let i = l - 1; i > -1; i--) {
        console.log('start loop', array[i], m, dec)

        dec += array[i] * m;
        console.log('addition', dec);
        // multiply the index' value by multiplier

        m *= 2;
        // multiply multiplier by 2 (1 -> 2 -> 4 -> 8 -> 16 ...)
    }
    // loop through array from end to front

    return dec;
}
// convert by looping through array

const getDecReduce = (array) => {
    let dec = 0;
    // store sum of calculation

    let m = Math.pow(2, (array.length - 1));
    // initial multiplier for bit position (... 16, 8, 4, 2, 1)
    // starts out as highest multiplier in order to go "backwards" in reduce()

    console.log('reduce length', array.length);
    console.log('reduce m', m);

    dec = array.reduce((total, current) => {
        console.log('reduce current', current);
        let calc = total + (current * m)
        console.log('reduce calc', calc);
        m /= 2;
        return calc
    }, dec)

    console.log('reduce dec', dec)

    return dec;
}
// convert by reducing array

const bitToDec = () => {
    const inputBits = inputBit.value;
    console.log('inputBits', inputBits, typeof inputBits);
    // get input value as string

    const bits = transformString(inputBits)
    console.log('transformed bits', bits, typeof bits);
    // transform the string into a usable array of integers

    /*
    const dec = getDec(bits);
    console.log('returned dec', dec, typeof dec);
    // convert from bits to decimal
    */

    const dec = getDecReduce(bits);

    resultBit.innerHTML = dec;
    // display result as decimal
}