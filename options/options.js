let userConfigs;
var ids = [];
let keys;

function restoreOptions() {
  try {
    keys = Object.keys(configs);

    keys.forEach(function (key) {
      ids.push('#' + key);
    });

    chrome.storage.local.get(keys, setInputs);

    function setInputs(result) {
      userConfigs = result;

      console.log('restored configs:');
      console.log(result);

      /// Iterable approach
      keys.forEach(function (key) {
        let value = userConfigs[key];
        var input = document.getElementById(key);

        /// Set input value
        if (input !== null && input !== undefined) {
          if (input.type == 'checkbox') {
            // if ((result[key] !== null && result[key] == true) || (result[key] == null && value == true))
            if (result[key] == true)
              input.setAttribute('checked', 0)
          }
          else
            input.setAttribute('value', result[key] ?? value);

          /// Set translated label for input
          if (!input.parentNode.innerHTML.includes(chrome.i18n.getMessage(key)))
            input.parentNode.innerHTML += chrome.i18n.getMessage(key);
        }
      });

      var inputs = document.querySelectorAll(ids.join(','));
      inputs.forEach(function (input) {
        input.addEventListener("input", function (e) {

          let id = input.getAttribute('id');
          let inputValue = input.getAttribute('type') == 'checkbox' ? input.checked : input.value;

          userConfigs[id] = inputValue;
          saveAllOptions();

          console.log('config: ' + id.toString());
          console.log('value: ' + inputValue.toString());
          updatePreviewTile();
          updateDisabledOptions();
          // chrome.storage.local.set({ id: inputValue });
        })
      });

      /// Set translated tooltips
      document.querySelector("#moveSuggestionsToBottomTooltip").innerHTML = chrome.i18n.getMessage("moveSuggestionsToBottomTooltip");
      document.querySelector("#numericNavigationTooltip").innerHTML = chrome.i18n.getMessage("numericNavigationTooltip");
      document.querySelector("#navigateWithKeyboardTooltip").innerHTML = chrome.i18n.getMessage("navigateWithKeyboardTooltip");
      document.querySelector("#firstNumberPressScrollsToElementTooltip").innerHTML = chrome.i18n.getMessage("firstNumberPressScrollsToElementTooltip");
      document.querySelector("#colorizeBorderAfterFaviconTooltip").innerHTML = chrome.i18n.getMessage("colorizeBorderAfterFaviconTooltip");

      /// Set translated headers
      document.querySelector("#previewHeader").innerHTML = chrome.i18n.getMessage("preview");
      document.querySelector("#appearanceHeader").innerHTML = chrome.i18n.getMessage("appearance");
      document.querySelector("#faviconsHeader").innerHTML = chrome.i18n.getMessage("header");
      document.querySelector("#hoverHeader").innerHTML = chrome.i18n.getMessage("hover");
      document.querySelector("#searchResultsHeader").innerHTML = chrome.i18n.getMessage("searchResults");
      document.querySelector("#keyboardNavigationHeader").innerHTML = chrome.i18n.getMessage("keyboardNavigation");
      // document.querySelector("#allChangesSavedAutomaticallyHeader").innerHTML = '💾 ' + chrome.i18n.getMessage("allChangesSavedAutomatically");
      document.querySelector("#allChangesSavedAutomaticallyHeader").innerHTML = chrome.i18n.getMessage("allChangesSavedAutomatically");

      /// Translate footer buttons
      document.querySelector("#resetButton").innerHTML = chrome.i18n.getMessage("resetDefaults");
      document.querySelector("#githubButton").innerHTML = chrome.i18n.getMessage("visitGithub") + document.querySelector("#githubButton").innerHTML;
      document.querySelector("#donateButton").innerHTML = chrome.i18n.getMessage("buyMeCoffee") + document.querySelector("#donateButton").innerHTML;

      updatePreviewTile();
      updateDisabledOptions();
      setCollapsibleHeaders();
    }





  } catch (error) { console.log(error); }
}

function updateDisabledOptions() {
  document.querySelector("#faviconRadius").parentNode.className = document.querySelector("#addFavicons").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#shadowOpacity").parentNode.className = document.querySelector("#shadowEnabled").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardCycle").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#applyStyleToWidgets").parentNode.className = document.querySelector("#tryToPlaceSuggestionsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardFocusBorderColor").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  // document.querySelector("#focusedBorderWidth").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#focusedBorderWidth").parentNode.className = document.querySelector("#addTileBorder").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#addTileCounter").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#numbersNavigateTabs").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#indexHintOpacity").parentNode.className = document.querySelector("#addTileCounter").checked && document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#delayToScrollOnHover").parentNode.className = document.querySelector("#scrollHorizontalViewOnHover").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#showFullDomainOnHover").parentNode.className = document.querySelector("#simplifyDomain").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#titleHoverColor").parentNode.className = document.querySelector("#highlightTitleOnHover").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#tileBackgroundColor").parentNode.className = document.querySelector("#addTileBackground").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#borderColor").parentNode.className = document.querySelector("#addTileBorder").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#sidebarWidthMultiplier").parentNode.className = document.querySelector("#tryToPlaceSuggestionsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#firstNumberPressScrollsToElement").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#sideArrowsFocusSidebarFirst").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#colorizeBorderAfterFavicon").parentNode.className = document.querySelector("#addFavicons").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardFocusBorderColor").parentNode.className = document.querySelector("#focusedTileDifferentBorder").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#scaleUpFocusedResultAmount").parentNode.className = document.querySelector("#scaleUpFocusedResult").checked ? 'enabled-option' : 'disabled-option';
}

function updatePreviewTile() {
  var innerPadding = document.querySelector("#innerPadding").value;
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
  var faviconRadius = document.querySelector("#faviconRadius").value;
  var highlightTitleOnHover = document.querySelector("#highlightTitleOnHover").checked;
  var titleHoverColor = document.querySelector("#titleHoverColor").value;
  var disableTitleUnderlineOnHover = document.querySelector("#disableTitleUnderlineOnHover").checked;
  var numbersNavigateTabs = document.querySelector("#numbersNavigateTabs").checked;
  var numericNavigation = document.querySelector("#numericNavigation").checked;
  var showFullDomainOnHover = document.querySelector("#showFullDomainOnHover").checked;
  var colorizeBorderAfterFavicon = document.querySelector("#colorizeBorderAfterFavicon").checked;

  /// Set preview tile style
  var tile = document.querySelector('#previewTile');
  tile.setAttribute("style", `background-color:${tileBackgroundColor};align-items: center;width: ${widerTiles ? 100 : 85}%;cursor:${wholeTileIsClickable ? 'pointer' : 'auto'};border:solid ${focusedBorderWidth || '1'}px ${addTileBorder ? colorizeBorderAfterFavicon ? '#4A96F5' : '#DADCE0' : 'transparent'};border-radius: ${borderRadius || '6'}px;transition:all ${hoverTransitionDuration || '300'}ms ease-out;padding: ${innerPadding || '12'}px;box-shadow: ${(shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity || '0.15'})` : 'unset'};`);

  /// Change favicon and counter hint visibility
  document.querySelector('#previewFavicon').style.cssText = `display: ${addFavicons == false ? 'none' : 'inline'};height:${faviconRadius}px; width:${faviconRadius}px;  `;

  document.querySelector('#previewCounter').style.visibility = addTileCounter == false || numbersNavigateTabs == true || numericNavigation == false ? 'collapse' : 'visible';
  document.querySelector('#previewCounter').style.opacity = indexHintOpacity;
  document.querySelector('#previewDomain').textContent = simplifyDomain ? 'google' : 'www.google.com.ua';
  document.querySelector('#previewDomain').title = showFullDomainOnHover ? 'www.google.com.ua' : '';


  var title = document.getElementById('previewTitle');

  /// Set mouse listeners
  tile.onmouseover = function () {
    tile.style.backgroundColor = hoverBackground || '#f0f2f4';
    if (highlightTitleOnHover)
      title.style.color = titleHoverColor;

    if (disableTitleUnderlineOnHover == false)
      title.style.textDecoration = 'underline';
  }
  tile.onmouseout = function () {
    tile.style.backgroundColor = tileBackgroundColor;
    if (highlightTitleOnHover)
      document.getElementById('previewTitle').style.color = 'blue';
    if (disableTitleUnderlineOnHover == false)
      title.style.textDecoration = 'none';
  }
  tile.onmousedown = function () { if (wholeTileIsClickable == false) return; tile.style.boxShadow = (shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity / 2})` : 'unset'; }
  tile.onmouseup = function () { if (wholeTileIsClickable == false) return; tile.style.boxShadow = (shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})` : 'unset'; }
}

function setCollapsibleHeaders() {
  var coll = document.getElementsByClassName("collapsible-header");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.overflow = 'hidden';
        // content.style.border = 'none';
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        setTimeout(function () {
          content.style.overflow = 'visible';
        }, 200);
        // content.style.border = '1px solid #444';
      }
    });
  }
}

function saveAllOptions() {
  // var dataToSave = {};

  // keys.forEach(function (key) {
  //   var input = document.querySelector(`#${key}`);
  //   dataToSave[key] = input.type == 'checkbox' ? input.checked : input.value;
  // });

  // chrome.storage.local.set(dataToSave);

  chrome.storage.local.set(userConfigs);
}


function resetOptions() {

  var dataToSave = {};

  userConfigs.forEach(function (value, key) {
    dataToSave[key] = value;
  });

  // chrome.storage.local.set(dataToSave);
  chrome.storage.local.set(dataToSave);

  // chrome.storage.local.set({
  //   innerPadding: 12,
  //   externalPadding: 24,
  //   hoverTransitionDuration: 75,
  //   borderRadius: 12,
  //   hoverBackground: '#f0f2f4',
  //   shadowEnabled: true,
  //   shadowOpacity: 0.15,
  //   moveSuggestionsToBottom: true,
  //   addFavicons: true,
  //   faviconRadius: 12,
  //   navigateWithKeyboard: true,
  //   keyboardCycle: true,
  //   keyboardFocusBorderColor: '#210DAB',
  //   focusedBorderWidth: 1,
  //   addTileCounter: true,
  //   numericNavigation: true,
  //   indexHintOpacity: 0.5,
  //   wholeTileIsClickable: true,
  //   tryToPlaceSuggestionsOnTheSide: true,
  //   applyStyleToWidgets: true,
  //   simplifyDomain: true,
  //   widerTiles: true,
  //   scaleUpImageResultsOnHover: true,
  //   scrollHorizontalViewOnHover: true,
  //   tileBackgroundColor: '#FFFFFF',
  //   addTileBorder: true,
  //   delayToScrollOnHover: 150
  // });
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
