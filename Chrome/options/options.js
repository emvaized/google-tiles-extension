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
    numericNavigation: true
  });
  restoreOptions();
}

function saveOptions(e) {

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
  });
  e.preventDefault();
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

  }

  function onError(error) {
    console.log(`Error: ${error}`);
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
    'addTileCounter'
  ], setCurrentChoices);



}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", resetOptions);
document.querySelector("#donateButton").addEventListener("click", function (val) {
  // alert('https://www.liqpay.ua/checkout/i17319531101');
  window.open('https://www.liqpay.ua/checkout/i17319531101', '_blank');
});
