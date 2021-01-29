function resetOptions() {
  chrome.storage.local.set({
    innerPadding: 12,
    externalPadding: 24,
    hoverTransitionDuration: 75,
    borderRadius: 6,
    hoverBackground: '#f0f2f4',
    shadowEnabled: true,
    shadowOpacity: 0.15,
    moveSuggestionsToBottom: true,
    addFavicons: true,
    faviconRadius: 12,
    navigateWithKeyboard: false,
    keyboardCycle: true,
    keyboardFocusBorderColor: '#210DAB',
    focusedBorderWidth: 1,
    addTileCounter: true,
    numericNavigation: true,
    indexHintOpacity: 0.5,
  });
  restoreOptions();
}

function updatePreviewTileStyle() {

  saveOptions();

  var innerPadding = document.querySelector("#innerPadding").value;
  var externalPadding = document.querySelector("#externalPadding").value;
  var hoverTransitionDuration = document.querySelector("#hoverTransitionDuration").value;
  var borderRadius = document.querySelector("#borderRadius").value;
  var hoverBackground = document.querySelector("#hoverBackground").value;
  var shadowEnabled = document.querySelector("#shadowEnabled").checked;
  var shadowOpacity = document.querySelector("#shadowOpacity").value;
  var addFavicons = document.querySelector("#addFavicons").checked;
  var focusedBorderWidth = document.querySelector("#focusedBorderWidth").value;
  var addTileCounter = document.querySelector("#addTileCounter").checked;
  var indexHintOpacity = document.querySelector("#indexHintOpacity").value;

  /// Set preview tile style
  var tile = document.querySelector('#previewTile');
  tile.setAttribute("style", `cursor:pointer;border:solid ${focusedBorderWidth || '1'}px transparent;border-radius: ${borderRadius || '6'}px;transition:all ${hoverTransitionDuration || '300'}ms ease-out;padding: ${innerPadding || '12'}px;margin: 0px 0px ${externalPadding || 24}px;box-shadow: ${(shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity || '0.15'})` : 'unset'};`);

  /// Change favicon and counter hint visibility
  document.querySelector('#previewFavicon').setAttribute("style", addFavicons == false ? 'display:none' : 'display:inline');
  document.querySelector('#previewCounter').style.visibility = addTileCounter == false ? 'collapse' : 'visible';
  document.querySelector('#previewCounter').style.opacity = indexHintOpacity;

  /// Set mouse listeners
  tile.onmouseover = function () { tile.style.backgroundColor = hoverBackground || '#f0f2f4'; }
  tile.onmouseout = function () { tile.style.backgroundColor = "transparent"; }

  tile.onmousedown = function () {
    tile.style.boxShadow = (shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity / 2})` : 'unset';
  }
  tile.onmouseup = function () {
    tile.style.boxShadow = (shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})` : 'unset';
  }

}

function saveOptions() {
  chrome.storage.local.set({
    innerPadding: document.querySelector("#innerPadding").value,
    externalPadding: document.querySelector("#externalPadding").value,
    hoverTransitionDuration: document.querySelector("#hoverTransitionDuration").value,
    borderRadius: document.querySelector("#borderRadius").value,
    hoverBackground: document.querySelector("#hoverBackground").value,
    shadowEnabled: document.querySelector("#shadowEnabled").checked,
    shadowOpacity: document.querySelector("#shadowOpacity").value,
    moveSuggestionsToBottom: document.querySelector("#moveSuggestionsToBottom").checked,
    addFavicons: document.querySelector("#addFavicons").checked,
    faviconRadius: document.querySelector("#faviconRadius").value,
    navigateWithKeyboard: document.querySelector("#navigateWithKeyboard").checked,
    keyboardCycle: document.querySelector("#keyboardCycle").checked,
    keyboardFocusBorderColor: document.querySelector("#keyboardFocusBorderColor").value,
    focusedBorderWidth: document.querySelector("#focusedBorderWidth").value,
    numericNavigation: document.querySelector("#numericNavigation").checked,
    addTileCounter: document.querySelector("#addTileCounter").checked,
    indexHintOpacity: document.querySelector("#indexHintOpacity").value,
  });

}

function restoreOptions() {

  function setCurrentChoices(result) {
    document.querySelector("#innerPadding").value = result.innerPadding || 12;
    document.querySelector("#externalPadding").value = result.externalPadding || 24;
    document.querySelector("#borderRadius").value = result.borderRadius || 6;
    document.querySelector("#hoverTransitionDuration").value = result.hoverTransitionDuration || 75;
    document.querySelector("#hoverBackground").value = result.hoverBackground || '#f0f2f4';
    document.querySelector("#shadowEnabled").checked = result.shadowEnabled ?? true;
    document.querySelector("#shadowOpacity").value = result.shadowOpacity || 0.15;
    document.querySelector("#moveSuggestionsToBottom").checked = result.moveSuggestionsToBottom ?? true;
    document.querySelector("#addFavicons").checked = result.addFavicons ?? true;
    document.querySelector("#faviconRadius").value = result.faviconRadius || 12;
    document.querySelector("#navigateWithKeyboard").checked = result.navigateWithKeyboard ?? false;
    document.querySelector("#keyboardCycle").checked = result.keyboardCycle ?? true;
    document.querySelector("#keyboardFocusBorderColor").value = result.keyboardFocusBorderColor ?? '#210DAB';
    document.querySelector("#focusedBorderWidth").value = result.focusedBorderWidth || 1;
    document.querySelector("#numericNavigation").checked = result.numericNavigation ?? true;
    document.querySelector("#addTileCounter").checked = result.addTileCounter ?? true;
    document.querySelector("#indexHintOpacity").value = result.indexHintOpacity || 0.5;

    updatePreviewTileStyle();

    var inputs = document.querySelectorAll('#indexHintOpacity,#innerPadding,#numericNavigation, #focusedBorderWidth, #keyboardFocusBorderColor,#keyboardCycle,#navigateWithKeyboard, #externalPadding, #borderRadius, #hoverTransitionDuration, #hoverBackground, #addTileCounter, #shadowEnabled, #shadowOpacity, #addFavicons, #addFavicons,  #faviconRadius');

    inputs.forEach(function (input) {
      input.addEventListener("change", updatePreviewTileStyle)
    });
  }


  chrome.storage.local.get([
    'innerPadding',
    'externalPadding',
    'hoverTransitionDuration',
    'borderRadius',
    'hoverBackground',
    'shadowEnabled',
    'shadowOpacity',
    'moveSuggestionsToBottom',
    'addFavicons',
    'faviconRadius',
    'navigateWithKeyboard',
    'keyboardCycle',
    'keyboardFocusBorderColor',
    'focusedBorderWidth',
    'numericNavigation',
    'addTileCounter',
    'indexHintOpacity'
  ], setCurrentChoices);



}

document.addEventListener("DOMContentLoaded", restoreOptions);
// document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", resetOptions);
document.querySelector("#donateButton").addEventListener("click", function (val) {
  window.open('https://www.liqpay.ua/checkout/i17319531101', '_blank');
});
