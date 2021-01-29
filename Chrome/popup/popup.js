
function saveOptions(e) {
  chrome.storage.local.set({
    tilesEnabled: document.querySelector("#tilesEnabled").checked,
  });
  // e.preventDefault();
}

function restoreOptions() {
  chrome.storage.local.get(
    'tilesEnabled', function (res) {
      document.querySelector("#tilesEnabled").checked = res.tilesEnabled ?? true;
    });
  // gettingItem.then((res) => {
  //   document.querySelector("tilesEnabled").checked = res.tilesEnabled ?? true;
  // });
}



document.addEventListener('DOMContentLoaded', restoreOptions);
// document.querySelector("tilesEnabled").addEventListener("change", saveOptions);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("settings")) {
    chrome.runtime.openOptionsPage();
    window.close();
  }
  else if (e.target.classList.contains("checkbox")) {
    saveOptions(e);
  }
});

