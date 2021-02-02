
function saveOptions(e) {
  chrome.storage.local.set({
    tilesEnabled: document.querySelector("#tilesEnabled").checked,
  });
}

function restoreOptions() {
  var settingsButton = document.querySelector('#settingsButton');
  settingsButton.innerHTML = settingsButton.innerHTML + ' ' + chrome.i18n.getMessage("configure");
  var enabledCheckbox = document.querySelector('#tilesEnabled');
  enabledCheckbox.parentNode.innerHTML = chrome.i18n.getMessage("enabled") + enabledCheckbox.parentNode.innerHTML;

  chrome.storage.local.get(
    'tilesEnabled', function (res) {
      document.querySelector("#tilesEnabled").checked = res.tilesEnabled ?? true;
    });
}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("settings")) {
    chrome.runtime.openOptionsPage();
    window.close();
  }
  else if (e.target.classList.contains("checkbox") || e.target.classList.contains("checkboxLabel")) {
    // else if (e.target.classList.contains("enabled-checkbox") || e.target.classList.contains('checkboxLabel')) {
    saveOptions(e);
  }
});

