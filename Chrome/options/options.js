// TODO: 
// Reduce the amount of iterations here by separating all 'id' values in array of strings 
// (or map of strings with default values), 
// which can be iterated everywhere it's needed.

function restoreOptions() {

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
    'indexHintOpacity',
    'wholeTileIsClickable',
    'tryToPlaceSuggestionsOnTheSide',
    'applyStyleToWidgets',
    'simplifyDomain',
    'widerTiles',
    'scaleUpImageResultsOnHover',
    'scrollHorizontalViewOnHover',
    'addTileBorder',
    'tileBackgroundColor',
    'delayToScrollOnHover',
  ], setInputs);

  function setInputs(result) {
    /// Set translated labels for inputs
    document.querySelector("#innerPadding").parentNode.innerHTML += chrome.i18n.getMessage("innerPadding");
    document.querySelector("#externalPadding").parentNode.innerHTML += chrome.i18n.getMessage("externalPadding");
    document.querySelector("#borderRadius").parentNode.innerHTML += chrome.i18n.getMessage("borderRadius");
    document.querySelector("#hoverTransitionDuration").parentNode.innerHTML += chrome.i18n.getMessage("hoverTransitionDuration");
    document.querySelector("#hoverBackground").parentNode.innerHTML += chrome.i18n.getMessage("hoverBackground");
    document.querySelector("#shadowEnabled").parentNode.innerHTML += chrome.i18n.getMessage("shadowEnabled");
    document.querySelector("#shadowOpacity").parentNode.innerHTML += chrome.i18n.getMessage("shadowOpacity");
    document.querySelector("#addFavicons").parentNode.innerHTML += chrome.i18n.getMessage("addFavicons");
    document.querySelector("#faviconRadius").parentNode.innerHTML += chrome.i18n.getMessage("faviconRadius");
    document.querySelector("#keyboardCycle").parentNode.innerHTML += chrome.i18n.getMessage("keyboardCycle");
    document.querySelector("#keyboardFocusBorderColor").parentNode.innerHTML += chrome.i18n.getMessage("keyboardFocusBorderColor");
    document.querySelector("#focusedBorderWidth").parentNode.innerHTML += chrome.i18n.getMessage("focusedBorderWidth");
    document.querySelector("#addTileCounter").parentNode.innerHTML += chrome.i18n.getMessage("addTileCounter");
    document.querySelector("#indexHintOpacity").parentNode.innerHTML += chrome.i18n.getMessage("indexHintOpacity");
    document.querySelector("#wholeTileIsClickable").parentNode.innerHTML += chrome.i18n.getMessage("wholeTileIsClickable");
    document.querySelector("#moveSuggestionsToBottom").parentNode.innerHTML += chrome.i18n.getMessage("moveSuggestionsToBottom");
    document.querySelector("#numericNavigation").parentNode.innerHTML += chrome.i18n.getMessage("numericNavigation");
    document.querySelector("#navigateWithKeyboard").parentNode.innerHTML += chrome.i18n.getMessage("navigateWithKeyboard");
    document.querySelector("#tryToPlaceSuggestionsOnTheSide").parentNode.innerHTML += chrome.i18n.getMessage("tryToPlaceSuggestionsOnTheSide");
    document.querySelector("#applyStyleToWidgets").parentNode.innerHTML += chrome.i18n.getMessage("applyStyleToWidgets");
    document.querySelector("#simplifyDomain").parentNode.innerHTML += chrome.i18n.getMessage("simplifyDomain");
    document.querySelector("#widerTiles").parentNode.innerHTML += chrome.i18n.getMessage("widerTiles");
    document.querySelector("#scaleUpImageResultsOnHover").parentNode.innerHTML += chrome.i18n.getMessage("scaleUpImageResultsOnHover");
    document.querySelector("#scrollHorizontalViewOnHover").parentNode.innerHTML += chrome.i18n.getMessage("scrollHorizontalViewOnHover");
    document.querySelector("#addTileBorder").parentNode.innerHTML += chrome.i18n.getMessage("addTileBorder");
    document.querySelector("#tileBackgroundColor").parentNode.innerHTML += chrome.i18n.getMessage("tileBackgroundColor");
    document.querySelector("#delayToScrollOnHover").parentNode.innerHTML += chrome.i18n.getMessage("delayToScrollOnHover");

    /// Set translated tooltips
    document.querySelector("#moveSuggestionsToBottomTooltip").innerHTML = chrome.i18n.getMessage("moveSuggestionsToBottomTooltip");
    document.querySelector("#numericNavigationTooltip").innerHTML = chrome.i18n.getMessage("numericNavigationTooltip");
    document.querySelector("#navigateWithKeyboardTooltip").innerHTML = chrome.i18n.getMessage("navigateWithKeyboardTooltip");

    /// Set translated headers
    document.querySelector("#previewHeader").innerHTML = chrome.i18n.getMessage("preview");
    document.querySelector("#appearanceHeader").innerHTML = chrome.i18n.getMessage("appearance");
    // document.querySelector("#faviconsHeader").innerHTML = chrome.i18n.getMessage("favicons");
    document.querySelector("#faviconsHeader").innerHTML = chrome.i18n.getMessage("header");
    document.querySelector("#hoverHeader").innerHTML = chrome.i18n.getMessage("hover");
    document.querySelector("#searchResultsHeader").innerHTML = chrome.i18n.getMessage("searchResults");
    document.querySelector("#keyboardNavigationHeader").innerHTML = chrome.i18n.getMessage("keyboardNavigation");
    document.querySelector("#allChangesSavedAutomaticallyHeader").innerHTML = '💾 ' + chrome.i18n.getMessage("allChangesSavedAutomatically");

    /// Translate footer buttons
    document.querySelector("#resetButton").innerHTML = chrome.i18n.getMessage("resetDefaults");
    document.querySelector("#githubButton").innerHTML = chrome.i18n.getMessage("visitGithub") + document.querySelector("#githubButton").innerHTML;
    document.querySelector("#donateButton").innerHTML = chrome.i18n.getMessage("buyMeCoffee") + document.querySelector("#donateButton").innerHTML;

    /// Set inputs values
    document.querySelector("#innerPadding").value = result.innerPadding || 12;
    document.querySelector("#externalPadding").value = result.externalPadding || 24;
    document.querySelector("#borderRadius").value = result.borderRadius || 12;
    document.querySelector("#hoverTransitionDuration").value = result.hoverTransitionDuration || 75;
    document.querySelector("#hoverBackground").value = result.hoverBackground || '#f0f2f4';
    document.querySelector("#shadowEnabled").checked = result.shadowEnabled ?? true;
    document.querySelector("#shadowOpacity").value = result.shadowOpacity || 0.15;
    document.querySelector("#moveSuggestionsToBottom").checked = result.moveSuggestionsToBottom ?? true;
    document.querySelector("#addFavicons").checked = result.addFavicons ?? true;
    document.querySelector("#faviconRadius").value = result.faviconRadius || 12;
    document.querySelector("#navigateWithKeyboard").checked = result.navigateWithKeyboard ?? true;
    document.querySelector("#keyboardCycle").checked = result.keyboardCycle ?? true;
    document.querySelector("#keyboardFocusBorderColor").value = result.keyboardFocusBorderColor ?? '#210DAB';
    document.querySelector("#focusedBorderWidth").value = result.focusedBorderWidth || 1;
    document.querySelector("#numericNavigation").checked = result.numericNavigation ?? true;
    document.querySelector("#addTileCounter").checked = result.addTileCounter ?? true;
    document.querySelector("#indexHintOpacity").value = result.indexHintOpacity || 0.5;
    document.querySelector("#wholeTileIsClickable").checked = result.wholeTileIsClickable ?? true;
    document.querySelector("#tryToPlaceSuggestionsOnTheSide").checked = result.tryToPlaceSuggestionsOnTheSide ?? true;
    document.querySelector("#applyStyleToWidgets").checked = result.applyStyleToWidgets ?? true;
    document.querySelector("#simplifyDomain").checked = result.simplifyDomain ?? true;
    document.querySelector("#widerTiles").checked = result.widerTiles ?? true;
    document.querySelector("#scaleUpImageResultsOnHover").checked = result.scaleUpImageResultsOnHover ?? true;
    document.querySelector("#scrollHorizontalViewOnHover").checked = result.scrollHorizontalViewOnHover ?? true;
    document.querySelector("#addTileBorder").checked = result.addTileBorder ?? false;
    document.querySelector("#tileBackgroundColor").value = result.tileBackgroundColor ?? '#FFFFFF';
    document.querySelector("#delayToScrollOnHover").value = result.delayToScrollOnHover || 150;

    /// Set listeners for the inputs
    var inputs = document.querySelectorAll('#delayToScrollOnHover,#tileBackgroundColor,#addTileBorder,#scrollHorizontalViewOnHover,#scaleUpImageResultsOnHover,#widerTiles,#simplifyDomain,#moveSuggestionsToBottom,#applyStyleToWidgets,#tryToPlaceSuggestionsOnTheSide, #indexHintOpacity,#wholeTileIsClickable,#innerPadding,#numericNavigation, #focusedBorderWidth, #keyboardFocusBorderColor,#keyboardCycle,#navigateWithKeyboard, #externalPadding, #borderRadius, #hoverTransitionDuration, #hoverBackground, #addTileCounter, #shadowEnabled, #shadowOpacity, #addFavicons, #addFavicons,  #faviconRadius');
    inputs.forEach(function (input) {
      input.addEventListener("input", function (e) {
        saveOptions();
        updatePreviewTile();
        updateDisabledOptions();
      })
    });

    updatePreviewTile();
    updateDisabledOptions();

  }
}

function updateDisabledOptions() {
  document.querySelector("#faviconRadius").parentNode.className = document.querySelector("#addFavicons").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#shadowOpacity").parentNode.className = document.querySelector("#shadowEnabled").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardCycle").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#applyStyleToWidgets").parentNode.className = document.querySelector("#tryToPlaceSuggestionsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardFocusBorderColor").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#focusedBorderWidth").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#addTileCounter").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#indexHintOpacity").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#delayToScrollOnHover").parentNode.className = document.querySelector("#scrollHorizontalViewOnHover").checked ? 'enabled-option' : 'disabled-option';
}

function updatePreviewTile() {
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
  var wholeTileIsClickable = document.querySelector("#wholeTileIsClickable").checked;
  var simplifyDomain = document.querySelector("#simplifyDomain").checked;
  var widerTiles = document.querySelector("#widerTiles").checked;
  var addTileBorder = document.querySelector("#addTileBorder").checked;
  var tileBackgroundColor = document.querySelector("#tileBackgroundColor").value;

  /// Set preview tile style
  var tile = document.querySelector('#previewTile');
  tile.setAttribute("style", `background-color:${tileBackgroundColor};align-items: center;width: ${widerTiles ? 100 : 85}%;cursor:${wholeTileIsClickable ? 'pointer' : 'auto'};border:solid ${focusedBorderWidth || '1'}px ${addTileBorder ? '#DADCE0' : 'transparent'};border-radius: ${borderRadius || '6'}px;transition:all ${hoverTransitionDuration || '300'}ms ease-out;padding: ${innerPadding || '12'}px;margin: 0px 0px ${externalPadding || 24}px;box-shadow: ${(shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity || '0.15'})` : 'unset'};`);

  /// Change favicon and counter hint visibility
  document.querySelector('#previewFavicon').setAttribute("style", addFavicons == false ? 'display:none' : 'display:inline');
  document.querySelector('#previewCounter').style.visibility = addTileCounter == false ? 'collapse' : 'visible';
  document.querySelector('#previewCounter').style.opacity = indexHintOpacity;
  document.querySelector('#previewDomain').textContent = simplifyDomain ? 'google' : 'www.google.com.ua';

  /// Set mouse listeners
  tile.onmouseover = function () { tile.style.backgroundColor = hoverBackground || '#f0f2f4'; }
  tile.onmouseout = function () { tile.style.backgroundColor = tileBackgroundColor; }
  tile.onmousedown = function () { if (wholeTileIsClickable == false) return; tile.style.boxShadow = (shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity / 2})` : 'unset'; }
  tile.onmouseup = function () { if (wholeTileIsClickable == false) return; tile.style.boxShadow = (shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})` : 'unset'; }
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
    wholeTileIsClickable: document.querySelector("#wholeTileIsClickable").checked,
    tryToPlaceSuggestionsOnTheSide: document.querySelector("#tryToPlaceSuggestionsOnTheSide").checked,
    applyStyleToWidgets: document.querySelector("#applyStyleToWidgets").checked,
    simplifyDomain: document.querySelector("#simplifyDomain").checked,
    widerTiles: document.querySelector("#widerTiles").checked,
    scaleUpImageResultsOnHover: document.querySelector("#scaleUpImageResultsOnHover").checked,
    scrollHorizontalViewOnHover: document.querySelector("#scrollHorizontalViewOnHover").checked,
    addTileBorder: document.querySelector("#addTileBorder").checked,
    tileBackgroundColor: document.querySelector("#tileBackgroundColor").value,
    delayToScrollOnHover: document.querySelector("#delayToScrollOnHover").value,
  });
}


function resetOptions() {
  chrome.storage.local.set({
    innerPadding: 12,
    externalPadding: 24,
    hoverTransitionDuration: 75,
    borderRadius: 12,
    hoverBackground: '#f0f2f4',
    shadowEnabled: true,
    shadowOpacity: 0.15,
    moveSuggestionsToBottom: true,
    addFavicons: true,
    faviconRadius: 12,
    navigateWithKeyboard: true,
    keyboardCycle: true,
    keyboardFocusBorderColor: '#210DAB',
    focusedBorderWidth: 1,
    addTileCounter: true,
    numericNavigation: true,
    indexHintOpacity: 0.5,
    wholeTileIsClickable: true,
    tryToPlaceSuggestionsOnTheSide: true,
    applyStyleToWidgets: true,
    simplifyDomain: true,
    widerTiles: true,
    scaleUpImageResultsOnHover: true,
    scrollHorizontalViewOnHover: true,
    tileBackgroundColor: '#FFFFFF',
    addTileBorder: false,
    delayToScrollOnHover: 150
  });
  restoreOptions();
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("reset", resetOptions);
document.querySelector("#donateButton").addEventListener("click", function (val) {
  window.open('https://emvaized.diaka.ua/donate', '_blank');
});
document.querySelector("#githubButton").addEventListener("click", function (val) {
  window.open('https://github.com/emvaized/google-tiles-extension', '_blank');
});
