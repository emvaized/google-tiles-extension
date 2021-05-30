
function saveOptions(e) {
  chrome.storage.local.set({
    tilesEnabled: document.querySelector("#tilesEnabled").checked,
  });
}

function restoreOptions() {
  setVersionLabel();

  var settingsButton = document.querySelector('#settingsButton');
  settingsButton.innerHTML = settingsButton.innerHTML + ' ' + chrome.i18n.getMessage("configure");
  var enabledCheckbox = document.querySelector('#tilesEnabled');
  enabledCheckbox.parentNode.innerHTML = chrome.i18n.getMessage("enabled") + enabledCheckbox.parentNode.innerHTML;

  chrome.storage.local.get(
    'tilesEnabled', function (res) {
      document.querySelector("#tilesEnabled").checked = res.tilesEnabled ?? true;
    });
}

function setVersionLabel() {
  let label = document.getElementById('extension-version');
  var manifestData = chrome.runtime.getManifest();
  label.innerHTML = manifestData.version + ` (<a target='_blank' href='https://github.com/emvaized/google-tiles-extension/blob/master/CHANGELOG.md'>${chrome.i18n.getMessage("whatsNew") ?? "What's new"}</a>)`;
}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("settings")) {
    chrome.runtime.openOptionsPage();
    window.close();
  }
  else if (e.target.classList.contains("checkbox") || e.target.classList.contains("checkboxLabel")) {

    saveOptions(e);

  }
});

