// Password Generator JS file
// Guthrie, 20191203

//*** Global Data and Constants ****/

// Separate arrays are defined where each contains the members of its
// named group of characters.
var LowerCaseArray = 
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
   "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const LOWERS_LEN = 26;

var UpperCaseArray = 
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
   "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const UPPERS_LEN = 26;

var DigitsArray = 
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const DIGITS_LEN = 10;

// Note use of escape characters for double quote, backslash, and apostrophe.
var SpecialCharsArray = 
  ["!", "\"","#", "$", "%", "&", "(", ")",
   "*", "+","\'", ",", "-", ".", "/", ":",
   ";", "<", "=", ">", "?","\\", "@", "[",
   "]", "^", "_", "`", "{", "|", "}", "~"];
const SPECIALS_LEN = 32;

// password length, pwdLen is a user input subject to required minimum and maximum
// length limits.
const MIN_LEN = 8;
const MAX_LEN = 128;
var pwdLen = MIN_LEN;

// usageCounts[] is the password requirements array, where for each character set, the 
// matching position value is interpreted as:
//   a) -1: do not use this character set.
//   b) Non-negative integer: the minimum number of characters from this character set.
const LOWERS   = 0;
const UPPERS   = 1;
const DIGITS   = 2;
const SPECIALS = 3;
var usageCounts = [0,0,0,0];

//*** Functions ***/

// function generatePassword(pwdLen, usageCounts) returns a character string of length
// pwdLen whose characters follow the requirements provided by usageCounts[]
//
// NOTE: generatePassword does not error-check pwdLen or its relationship to the 
// values in usageCounts[].  The UI must ensure that:
//   a) password length (pwdLen) meets any required length limits
//   b) the sum of required characters across the four character sets
//      does not exceed the required password length.
//

function generatePassword(pwdLen,usageCounts)
{
  var pwdArray = [];
  var i = 0;
  var j = 0;

  // To provide for minimum numbers of required characters by sets --
  // build 4 arrays holding assigned positions of characters from the corresponding set.
  // That is, each array holds positions in the password string which will be reserved
  // for assignment of characters from its set.  These values will be found at 
  // (pseudo-)random and will be unique across all the character sets.  Each array will
  // be sorted in ascending order.
  var lowerMandatories   = [];
  var upperMandatories   = [];
  var digitMandatories   = [];
  var specialMandatories = [];

  var numberArr = [];

  // assignMandatories(howMany, mandatoryArray) stuffs howMany values selected at random
  // from numberArr into mandatoryArray.  After a value from numberArr is used, that value
  // is removed from numberArr, so it will no longer be a candidate for selection.
  // A simple example of a first loop iteration:
  // 1. suppose numberArr = [0,1,2,3], so numberArr.length is 4
  // 2. Math.floor(Math.random()*4) gives an integer in 0..3.  Suppose it's 2
  // 3. value at numberArr[2], which is 2, is added to mandatoryArray
  // 4. numberArr[2] is removed, so numberArr.length becomes 3
  //    and numberArr is now [0,1,3]
  //
  function assignMandatories(howMany, mandatoryArray)
  {
    var selectedIndex = 0;

    // each loop iteration finds one value, stuffs it into mandatoryArray, and removes it from numberArr
    for (var i = 0; i < howMany; i++)
    {
      // random selection of index into numberArr
      selectedIndex = Math.floor(Math.random()*numberArr.length);

      // value at the selected location is added to mandatoryArray
      mandatoryArray.push(numberArr[selectedIndex]);

      // and removed from numberArr (which reduces the length of numberArr)
      numberArr.splice(selectedIndex,1);
    }
  }

  // Start body of generatePassword()

  // Create an array holding pwdLen ascending integers starting at 0.
  // These are the candidate locations for mandatory character types in the password.
  for (var i = 0; i < pwdLen; i++) { numberArr.push(i); }

  // Add up the total number of mandatory character type assignments
  totalMandatory = 0;
  for (i = LOWER; i <= SPECIAL; i++) { if (usageCounts[i] > 0) { totalMandatory += usageCounts[i]; } }

  if (totalMandatory)
  {
    assignMandatories(usageCounts[LOWERS]  ,  lowerMandatories);
    lowerMandatories.sort(function(a, b){return a-b});

    assignMandatories(usageCounts[UPPERS]  ,  upperMandatories);
    upperMandatories.sort(function(a, b){return a-b});
  
    assignMandatories(usageCounts[DIGITS]  ,  digitMandatories);
    digitMandatories.sort(function(a, b){return a-b});
  
    assignMandatories(usageCounts[SPECIALS],specialMandatories);
    specialMandatories.sort(function(a, b){return a-b});
  }

  // if not all positions are reserved, build a single array using all sets which may
  // be used as indicated by not having a usageCounts value of -1.  Use concat to build
  // the single array.
  if (totalMandatory < pwdLen)
  {
    var bigArray = [];
    if (usageCounts[LOWERS]   != -1) { bigArray.concat(LowerCaseArray);  }
    if (usageCounts[UPPERS]   != -1) { bigArray.concat(UpperCaseArray);  }
    if (usageCounts[DIGITS]   != -1) { bigArray.concat(DigitsArray);     }
    if (usageCounts[SPECIALS] != -1) { bigArray.concat(SpecialCaseArray);}
  }  


  // loop through all password positions.  At each, check if it is an assigned set position
  // and fill at random from that set if so.  Otherwise, assign to the position at random
  // from the combined set.
  for (i = 0; i < pwdLen; i++)
  {
    if (lowerMandatories.length && lowerMandories[0] == i)
    {
      j = Math.floor(Math.random()*LowerCaseArray.length);
      pwdArray.push(LowerCaseArray[j]);
      lowerMandories.shift();
    }
    else if (upperMandatories.length && upperMandories[0] == i)
    {
      j = Math.floor(Math.random()*UpperCaseArray.length);
      pwdArray.push(UpperCaseArray[j]);
      upperMandories.shift();
    }
    else if (digitMandatories.length && digitMandories[0] == i)
    {
      j = Math.floor(Math.random()*DigitsArray.length);
      pwdArray.push(DigitsArray[j]);
      digitMandories.shift();
    }
    else if (specialMandatories.length && specialMandories[0] == i)
    {
      j = Math.floor(Math.random()*SpecialCaseArray.length);
      pwdArray.push(SpecialCaseArray[j]);
      specialMandories.shift();
    }
    else
    {
      j = Math.floor(Math.random()*bigArray.length);
      pwdArray.push(bigArray[j]);
    }
  }

  // Our work here is almost done.  On the way out, convert the array of single character strings
  // into a single string.
  return(pwdArray.join(""));
}

// function writePassword() generates and writes a password into the #password 
// display area
function writePassword() 
{
  // build usageCounts based on UI inputs -- encode each location based on the
  // scheme described above.

  // call password generator 
  var password = generatePassword(pwdLen,usageCounts);

  // @@@@@ debug
  console.log(password);

  // @@@@@ don't know what this is doing specifically;
  // broadly it's supplying an object with a value field
  // that can hold the new password.
  var passwordText = document.querySelector("#password");

  // which is assigned here and is presumably also written into the password display box.
  passwordText.value = password;

  // and here's the code that activates the Copy to Clipboard button
  copyBtn.removeAttribute("disabled");
  copyBtn.focus();
}

// function copyToClipboard(pwdStr) copies pwdStr to the OS clipboard
// as an aid to the user in storing their newly minted password. 
function copyToClipboard(pwdStr) 
{
  // BONUS 
}

// Assignment Code
var generateBtn = document.querySelector("#generate");

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);

// BONUS EVENT LISTENER




