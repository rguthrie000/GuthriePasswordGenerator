function generatePassword()
{
   alert("Hi");
   var numChar = prompt("How many characters in your password?")
   if (isNaN(numChar) == true)
   {
     //re-enter number
   }

   // based on user responses, push character arrays into a single choice array

   // use concat to build the single array

   // or use 
   NewArray = Array.flat();
}

// Assignment Code
var generateBtn = document.querySelector("#generate");


// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");

  passwordText.value = password;

  copyBtn.removeAttribute("disabled");
  copyBtn.focus();
}

function copyToClipboard() {
  // BONUS 
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);

// BONUS EVENT LISTENER




