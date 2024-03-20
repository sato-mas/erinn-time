const outputField = document.getElementById('erinn-time');

function toDoubleDigits(value) {
  if (value < 10) {
    return value = "0" + value;
  }
  return value;
}

function to10MinutesInc(value) {
  if (value < 10) {
    return "00";
  }
  return Math.floor(value/10) + "0";
}

function displaytErinnTime() {
  const adjustSec = 18;
  const date = Date.now();
  const sec = (date % 2160000) / 1500 + adjustSec;
  const minutes = Math.floor(sec % 60);
  const hours = Math.floor((sec - minutes) / 60);

  outputField.value = toDoubleDigits(hours) + ':' + to10MinutesInc(minutes);
}

setInterval(displaytErinnTime, 1000);
