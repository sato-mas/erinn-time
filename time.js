// filename=time.js
const outputField = document.getElementById('erinn-time');
const settingsButton = document.getElementById('settings-button');
const settingsDialog = document.getElementById('settings-dialog');
const settingsForm = document.getElementById('settings-form');
const adjustSecInput = document.getElementById('adjust-sec');
const cancelButton = document.getElementById('cancel-button');

const ADJUST_SEC_STORAGE_KEY = 'erinn-time-adjust-sec';
const DEFAULT_ADJUST_SEC = 18;
const MIN_ADJUST_SEC = -30;
const MAX_ADJUST_SEC = 30;

function clampAdjustSec(value) {
  return Math.min(MAX_ADJUST_SEC, Math.max(MIN_ADJUST_SEC, value));
}

function loadAdjustSec() {
  const storedValue = Number(localStorage.getItem(ADJUST_SEC_STORAGE_KEY));
  return Number.isFinite(storedValue) ? clampAdjustSec(storedValue) : DEFAULT_ADJUST_SEC;
}

let adjustSec = loadAdjustSec();

function toDoubleDigits(value) {
  return String(value).padStart(2, '0');
}

function to10MinutesInc(value) {
  return Math.floor(value / 10) + '0';
}

function displayErinnTime() {
  // adjustSec is a real-world clock offset in seconds.
  const adjustedDate = Date.now() + adjustSec * 1000;
  const erinnMinutes = (adjustedDate % 2160000) / 1500;
  const minutes = Math.floor(erinnMinutes % 60);
  const hours = Math.floor(erinnMinutes / 60);

  outputField.value = toDoubleDigits(hours) + ':' + to10MinutesInc(minutes);
}

function openSettings() {
  adjustSecInput.value = String(adjustSec);
  settingsDialog.showModal();
  adjustSecInput.focus();
  adjustSecInput.select();
}

settingsButton.addEventListener('click', openSettings);

cancelButton.addEventListener('click', () => {
  settingsDialog.close();
});

settingsForm.addEventListener('submit', event => {
  event.preventDefault();

  if (!adjustSecInput.checkValidity()) {
    adjustSecInput.reportValidity();
    return;
  }

  const newAdjustSec = Number(adjustSecInput.value);
  if (!Number.isFinite(newAdjustSec)) {
    adjustSecInput.setCustomValidity('Please enter a number.');
    adjustSecInput.reportValidity();
    adjustSecInput.setCustomValidity('');
    return;
  }

  adjustSec = clampAdjustSec(newAdjustSec);
  localStorage.setItem(ADJUST_SEC_STORAGE_KEY, String(adjustSec));
  settingsDialog.close();
  displayErinnTime();
});

settingsDialog.addEventListener('click', event => {
  if (event.target === settingsDialog) {
    settingsDialog.close();
  }
});

displayErinnTime();
setInterval(displayErinnTime, 1000);
