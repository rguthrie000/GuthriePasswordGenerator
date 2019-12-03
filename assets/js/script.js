// Password Generator JS file
// Guthrie, 20191203

//*********************************/
//*** Global Data and Constants ***/
//*********************************/

// Separate arrays are defined where each contains the members of its
// named group of characters.
var LowerCaseArray = 
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
   "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

var UpperCaseArray = 
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
   "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var DigitsArray = 
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Note use of escape characters for double quote, backslash, and apostrophe.
var SpecialCharsArray = 
  ["!", "\"","#", "$", "%", "&", "(", ")","*", "+","\'", ",", "-", ".", "/", ":",
   ";", "<", "=", ">", "?","\\", "@", "[","]", "^", "_", "`", "{", "|", "}", "~"];

// For readability, use these constants as indexes for character sets.
const LOWERS   = 0;
const UPPERS   = 1;
const DIGITS   = 2;
const SPECIALS = 3;

//*****************/
//*** Functions ***/
//*****************/

//*****************************************************************************
// function generatePassword(pwdLen, usageCounts) returns a character string of length
// pwdLen whose characters follow the requirements provided by usageCounts[].
// usageCounts[] is an array of mandatory character counts indexed by the type
// constants defined globally.  Each value is interpreted as:
//   a) -1: do not use this character set.
//   b) Non-negative integer: the minimum number of characters from this character set.
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

    // each loop iteration finds one value, stuffs it into mandatoryArray, and 
    // removes it from numberArr[].  Removing the value ensures it will only
    // be used once across character sets.
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

  // Here's the body of generatePassword()

  // Create an array holding pwdLen ascending integers starting at 0.
  // These are the candidate locations for mandatory character types in the password.
  for (i = 0; i < pwdLen; i++) { numberArr.push(i); }

  // assign positions for mandatory lower case characters
  if (usageCounts[LOWERS] > 0)
  {
    assignMandatories(usageCounts[LOWERS]  ,  lowerMandatories);
    lowerMandatories.sort(  function(a, b){return a-b});
  }
  // assign positions for mandatory upper case characters
  if (usageCounts[UPPERS] > 0)
  {
    assignMandatories(usageCounts[UPPERS]  ,  upperMandatories);
    upperMandatories.sort(  function(a, b){return a-b});
  }
  // assign positions for mandatory digits
  if (usageCounts[DIGITS] > 0)
  {
    assignMandatories(usageCounts[DIGITS]  ,  digitMandatories);
    digitMandatories.sort(  function(a, b){return a-b});
  }
  // assign positions for mandatory special characters
  if (usageCounts[SPECIALS] > 0)
  {
    assignMandatories(usageCounts[SPECIALS],specialMandatories);
    specialMandatories.sort(function(a, b){return a-b});
  }

  // if not all positions are reserved, build a single array using all sets which may
  // be used as indicated by not having a usageCounts value of -1.  Use concat to build
  // the single array.
  var bigArray = [];
  if (usageCounts[LOWERS]   != -1) { bigArray = bigArray.concat(LowerCaseArray);   }
  if (usageCounts[UPPERS]   != -1) { bigArray = bigArray.concat(UpperCaseArray);   }
  if (usageCounts[DIGITS]   != -1) { bigArray = bigArray.concat(DigitsArray);      }
  if (usageCounts[SPECIALS] != -1) { bigArray = bigArray.concat(SpecialCharsArray);}

  // loop through all password positions.  At each, check if it is an assigned set position
  // and fill at random from that set if so.  Otherwise, assign to the position at random
  // from the combined set.
  for (i = 0; i < pwdLen; i++)
  {
    if (lowerMandatories.length && lowerMandatories[0] == i)
    {
      j = Math.floor(Math.random()*LowerCaseArray.length);
      pwdArray.push(LowerCaseArray[j]);
      lowerMandatories.shift();
    }
    else if (upperMandatories.length && upperMandatories[0] == i)
    {
      j = Math.floor(Math.random()*UpperCaseArray.length);
      pwdArray.push(UpperCaseArray[j]);
      upperMandatories.shift();
    }
    else if (digitMandatories.length && digitMandatories[0] == i)
    {
      j = Math.floor(Math.random()*DigitsArray.length);
      pwdArray.push(DigitsArray[j]);
      digitMandatories.shift();
    }
    else if (specialMandatories.length && specialMandatories[0] == i)
    {
      j = Math.floor(Math.random()*SpecialCharsArray.length);
      pwdArray.push(SpecialCharsArray[j]);
      specialMandatories.shift();
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

//*****************************************************************************
// function writePassword() generates and writes a password into the #password 
// display area
function writePassword() 
{
  // user-supplied variables
  var pwdLen = Number(document.querySelector("#pwdLen").value);
  // read status of checkboxes for permission to use different char types
  var mayUseLowerCase = document.getElementById("mayUseLowerCase").checked;
  var mayUseUpperCase = document.getElementById("mayUseUpperCase").checked;
  var mayUseDigits    = document.getElementById("mayUseDigits"   ).checked;
  var mayUseSpecials  = document.getElementById("mayUseSpecials" ).checked;
  // and read required minimums by character type
  var lowersMustUse   = Number(document.querySelector("#lowersMustUse"  ).value);
  var uppersMustUse   = Number(document.querySelector("#uppersMustUse"  ).value);
  var digitsMustUse   = Number(document.querySelector("#digitsMustUse"  ).value);
  var specialsMustUse = Number(document.querySelector("#specialsMustUse").value);

  // check for more mandatories requested than length allows.  Pop an alert if so,
  // then let the user fix the assignments before trying again.
  if (pwdLen < (totalMandatory = lowersMustUse+uppersMustUse+digitsMustUse+specialsMustUse))
  {
    alert("Oops! Total mandatory characters exceeds password length by " + 
          (totalMandatory-pwdLen)+".\n\nPlease adjust password length, " +
          "mandatory counts, or both!");
  }
  else if (!mayUseLowerCase && !mayUseUpperCase && !mayUseDigits && !mayUseSpecials)
  {
    alert("Hey! No character types have been selected!\n\nPlease check at least one character type.");
  }
  else
  {
    // build the data structure used by generatePassword().
    // (see generatePassword()).
    var usageCounts = [0,0,0,0];
    usageCounts[LOWERS]   = mayUseLowerCase ? lowersMustUse   : -1;
    usageCounts[UPPERS]   = mayUseUpperCase ? uppersMustUse   : -1;
    usageCounts[DIGITS]   = mayUseDigits    ? digitsMustUse   : -1;
    usageCounts[SPECIALS] = mayUseSpecials  ? specialsMustUse : -1;
    
    // call password generator 
    var password = generatePassword(pwdLen,usageCounts);

    // create an object for display in the password box
    // and assign the password string to the object.
    var passwordText = document.querySelector("#password");
    passwordText.value = password;

    // and here's the code that activates the Copy to Clipboard button
    clipboardBtn.removeAttribute("disabled");
    clipboardBtn.classList.add("buttonEnabled");
    clipboardBtn.focus();
  }
}

//*****************************************************************************
// function copyToClipboard(pwdStr) fetches the currently displayed
// password from textarea "password" and copies it to the OS clipboard.
function copyToClipboard() 
{
  var copyText = document.getElementById("password");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Password copied to Clipboard"); 
}

//**********************/
//*** Event Monitors ***/
//**********************/

// Listen for the Generate button.  On activation, call 
// writePassword(), which reads the dialogs, generates a
// compliant password, and assigns it for writing on
// the page.
var generateBtn = document.querySelector("#generate");
generateBtn.addEventListener("click", writePassword);

// Listen for the Copy to Clipboard button.  On activation,
// call copyToClipboard to fetch the password and copy it
// to the OS clipboard.
var clipboardBtn = document.querySelector("#copyBtn");
clipboardBtn.addEventListener("click", copyToClipboard);

