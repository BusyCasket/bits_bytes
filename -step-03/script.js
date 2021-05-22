let activeType = '';
// keep track of active dataType
// by checkboxes
// for handling input and converting

// handle checkboxes
// ====================

const [...boxes] = document.getElementsByClassName('checkDataType');
console.log('boxes', boxes);
// get checkbox elements as array (deconstructed from initial object)

activeType = boxes.find((box) => box.checked).getAttribute('id');
console.log('initial activeType', activeType);
// set active type according to checked box

boxes.map((box) => {
  box.addEventListener('change', (e) => {
    const id = e.target.getAttribute('id');
    console.log('checkbox changed', id, typeof id);
    // get elements id attribute as string

    activeType = id;
    console.log('activeType', activeType);
    // set activeType to type of clicked checkbox
  });
});

// handle input
// ====================

const inputConvert = document.getElementById('inputConvert');
// get the input element for bits

const resultDec = document.getElementById('result-dec');
const resultBit = document.getElementById('result-bit');
const resultHex = document.getElementById('result-hex');
// where to display converted inputs

const checkInput = (e) => {
  console.log('check input');

  const input = e.target;

  switch (activeType) {
    case 'dataTypeDec':
      console.log('check input switch dataTypeDec', activeType);
      input.value = input.value.replace(/[^0-9]+$/g, '');
      // check last character of current value string (+$) - so currently typed in character gets checked
      // check if it is NOT in the number range of 0-9 ([^0-9])
      // if it is in fact neither 0-9, replace it with nothing ('')
      break;
    case 'dataTypeBit':
      console.log('check input switch dataTypeBit', activeType);
      input.value = input.value.replace(/[^0-1]+$/g, '');
      // check last character of current value string (+$) - so currently typed in character gets checked
      // check if it is NOT in the number range of 0-1 ([^0-1])
      // if it is in fact neither 0 or 1, replace it with nothing ('')
      break;
    case 'dataTypeHex':
      console.log('check input switch dataTypeHex', activeType);
      input.value = input.value.toUpperCase().replace(/[^A-F0-9]+$/g, '');
      // check last character of current value string (+$) - so currently typed in character gets checked
      // check if it is NOT in the character range a-f nor number range of 0-9 ([^a-f0-9])
      // if it is in fact neither a-f nor 0-9, replace it with nothing ('')
      break;
  }
  // check current data type in order to apply respective checkups for user inputs
};

// handle converting
// ====================

// handle converting - check input

const warning = document.getElementById('warning');
// where to display potential warning

let warningStart, warningEnd;
// for (clearing) timeouts

const resetWarning = () => {
  clearTimeout(warningStart);
  clearTimeout(warningEnd);
  // clear timeouts, e.g. cancel fadeout of a currently displayd warning

  if (!warning.classList.contains('turnOff')) {
    console.log('warning... input empty, remove .turnOff');
    warning.classList.add('turnOff');
  }
  if (!warning.classList.contains('off')) {
    console.log('warning... input empty, remove .off');
    warning.classList.add('off');
  }
  // make sure classes "turnOff" and "off" are set
  // in order to initiate CSS transition for fade in
};

const displayWarning = (message) => {
  warning.classList.remove('turnOff');
  // display warning element
  warning.innerHTML = message;
  // set the appropriate warning message
  setTimeout(() => {
    warning.classList.remove('off');
  }, 25);
  // wait for display status, then remove class to trigger CSS transition
};

const hideWarning = () => {
  warning.classList.add('off');
  // trigger CSS animation
  setTimeout(() => {
    warning.classList.add('turnOff');
  }, 1025);
  // "display: none" after CSS transition-duration (1s) + some puffer
};

const giveWarning = (message) => {
  resetWarning();
  // reset warning element in case one is currently shown

  warningStart = setTimeout(() => {
    displayWarning(message);
    warningEnd = setTimeout(() => {
      hideWarning();
    }, 3000);
    // hide warning automatically after short time
  }, 25);
  // display current warning
  // give the reset some time

  console.log('warning: ', message);
};

const checkInputConvert = (input) => {
  let response = 'correct';
  // store value to return
  // 'correct' will not initiate a warning
  // all other results will initiate a warning and will be added to the warning text

  switch (activeType) {
    case 'dataTypeDec':
      let checkDec = /[^0-9]/;
      console.log('converting... check input dataTypeDec', activeType);
      console.log('converting... check input dataTypeDec regex', checkDec.test(input));
      if (checkDec.test(input)) {
        response = 'Allowed characters: 0–9';
      }
      break;
    // test input string for characters outside 0-9
    case 'dataTypeBit':
      let checkBit = /[^0-1]/;
      console.log('converting... check input dataTypeBit', activeType);
      console.log('converting... check input dataTypeBit regex', checkBit.test(input));
      if (checkBit.test(input)) {
        response = 'Allowed characters: 1 and 0';
      }
      break;
    // test input string for characters outside 0 or 1
    case 'dataTypeHex':
      let checkHex = /[^A-F0-9]/;
      let inputUp = input.toUpperCase();
      console.log('converting... check input dataTypeHex', activeType);
      console.log('converting... check input dataTypeHex regex', checkHex.test(inputUp));
      if (checkHex.test(inputUp)) {
        response = 'Allowed characters: 0–9, A–F';
      }
      break;
    // test input string for characters outside a-f and 0-9
  }
  return response;
};

// handle converting - converting

const ccDiff = 55;
// hex difference for charcode
// e.g. hex 10 + 55 = 65 (charcode for 'A');

const transformString = (string) => {
  let bits = string.split('');
  console.log('bits', bits, typeof bits);
  // create array from characters of that string

  bits = bits.filter((b) => b !== ' ');
  console.log('filtered bits', bits, typeof bits);
  // filter out potential spaces

  if (activeType === 'dataTypeBit') {
    bits = bits.map((b) => parseInt(b));
    console.log('mapped bits', bits, typeof bits);
  } else {
    console.log('else');
    bits = bits.map((b) => {
      console.log('map', parseInt(b));
      console.log('map', isNaN(parseInt(b)));
      if (!isNaN(parseInt(b))) {
        console.log('else if');
        return parseInt(b);
      } else {
        console.log('converting... trnasformString() hex', b.charCodeAt(0));
        return b.toUpperCase().charCodeAt(0) - ccDiff;
      }
    });
  }
  // turn string entries into integers
  // depending on binary or hex

  return bits;
};

const toDec = (array, base) => {
  const l = array.length;

  let dec = 0;
  // store the result

  for (let i = 0; i < l; i++) {
    const power = l - 1 - i;
    // first entry in array has the highest (base to the) power (of)
    // at every step further down the array the power decreases by 1 (solved by substracting the current index)

    dec += array[i] * Math.pow(base, power);
    console.log('loop math', base, power, dec);
    // multiply the index' value by base to the power of instance
  }
  return dec;
};
// loop through array calculating decimal

const getDecMaster = (string) => {
  const bits = transformString(string);
  console.log('transformed bits', bits, typeof bits);
  // bit or hex: transform the string into a usable array of integers

  const base = activeType === 'dataTypeBit' ? 2 : 16;
  // determine base of number system

  return toDec(bits, base);
  // return converted to dec(Master)
};

const decToOther = (decimal, base) => {
  let dec = decimal;

  let resultOther = '';
  // store result as string

  while (dec) {
    let next = dec % base;
    // the next character which needs to be added to result

    if (next > 9) {
      next = String.fromCharCode(next + ccDiff);
    }
    // catch hex conversion

    resultOther = String(next) + resultOther
    // turn "next" into string and insert it at the beginning of the result string

    dec = Math.floor(dec / base);
    // prepare "dec" for next round 
    // or if dec === 0, while will end
  }

  return resultOther;
};

const convert = (e) => {
  e.preventDefault();
  // prevent submit default

  const inputString = inputConvert.value;
  console.log('inputString', inputString, typeof inputString);
  // get input value as string

  let message = 'Invalid Input: ';
  // container for warning message depending on type of warning

  if (inputString === '') {
    console.log('converting... check input, empty', inputString);
    message += 'Please enter a value';
    giveWarning(message);
    return;
  }
  // give warning if input is empty

  const invalidInput = checkInputConvert(inputString);
  // if input is not empty, check for potential data type conflicts
  // might happen if data type checkbox gets changed after input
  // e.g. from hex "12ab" to decimal which does not accept "a" or "b"

  if (invalidInput !== 'correct') {
    message += invalidInput;
    console.log('convertin... check input, data type conflict', message);
    giveWarning(message);
    return;
  }
  // give warning if input is invalid

  // convert

  const decMaster = activeType === 'dataTypeDec' ? parseInt(inputString) : getDecMaster(inputString);
  // store whatever input as a decimal
  const binary = activeType === 'dataTypeBit' ? inputString : decToOther(decMaster, 2);
  const hex = activeType === 'dataTypeHex' ? inputString : decToOther(decMaster, 16);
  // determine binary and hex results
  // or take input string as is if activeType matches

  resultDec.innerHTML = decMaster;
  resultBit.innerHTML = binary;
  resultHex.innerHTML = hex;
  // display results as data type
};
