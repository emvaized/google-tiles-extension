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
        var input = document.getElementById(key);

        /// Set input value
        if (input !== null && input !== undefined) {
          if (input.type == 'checkbox') {
            if ((result[key] !== null && result[key] == true) || (result[key] == null && configs[key] == true))
              input.setAttribute('checked', 0)
          }
          else
            input.setAttribute('value', result[key] ?? configs[key]);

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
        })
      });

      /// Set translated tooltips
      document.querySelector("#numericNavigationTooltip").innerText = chrome.i18n.getMessage("numericNavigationTooltip");
      document.querySelector("#navigateWithKeyboardTooltip").innerText = chrome.i18n.getMessage("navigateWithKeyboardTooltip");
      document.querySelector("#firstNumberPressScrollsToElementTooltip").innerText = chrome.i18n.getMessage("firstNumberPressScrollsToElementTooltip");
      document.querySelector("#colorizeBorderAfterFaviconTooltip").innerText = chrome.i18n.getMessage("colorizeBorderAfterFaviconTooltip");

      /// Set translated headers
      document.querySelector("#previewHeader").innerText = chrome.i18n.getMessage("preview");
      document.querySelector("#appearanceHeader").innerText = chrome.i18n.getMessage("appearance");
      document.querySelector("#faviconsHeader").innerText = chrome.i18n.getMessage("header");
      document.querySelector("#hoverHeader").innerText = chrome.i18n.getMessage("hover");
      document.querySelector("#searchResultsHeader").innerText = chrome.i18n.getMessage("searchResults");
      document.querySelector("#keyboardNavigationHeader").innerText = chrome.i18n.getMessage("keyboardNavigation");
      document.querySelector("#allChangesSavedAutomaticallyHeader").innerHTML = chrome.i18n.getMessage("allChangesSavedAutomatically");

      /// Translate footer buttons
      document.querySelector("#writeAReviewButton").innerHTML = chrome.i18n.getMessage("writeAReview");
      document.querySelector("#githubButton").innerHTML = chrome.i18n.getMessage("visitGithub") + document.querySelector("#githubButton").innerHTML;
      document.querySelector("#donateButton").innerHTML = chrome.i18n.getMessage("buyMeCoffee") + document.querySelector("#donateButton").innerHTML;

      updatePreviewTile();
      updateDisabledOptions();
      setCollapsibleHeaders();
      setVersionLabel();
    }
  } catch (error) { console.log(error); }
}

function updateDisabledOptions() {
  document.querySelector("#shadowOpacity").parentNode.className = document.querySelector("#shadowEnabled").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardFocusBorderColor").parentNode.className = document.querySelector("#navigateWithKeyboard").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#focusedBorderWidth").parentNode.className = document.querySelector("#addTileBorder").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#colorizeBorderAfterFavicon").parentNode.parentNode.className = document.querySelector("#addTileBorder").checked ? 'option tooltip enabled-option' : 'option tooltip disabled-option';
  document.querySelector("#addTileCounter").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#indexHintOpacity").parentNode.className = document.querySelector("#addTileCounter").checked && document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#showFullDomainOnHover").parentNode.className = document.querySelector("#simplifyDomain").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#titleHoverColor").parentNode.className = document.querySelector("#highlightTitleOnHover").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#tileBackgroundColor").parentNode.className = document.querySelector("#addTileBackground").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#tileBackgroundOpacity").parentNode.className = document.querySelector("#addTileBackground").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#borderColor").parentNode.className = document.querySelector("#addTileBorder").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#firstNumberPressScrollsToElement").parentNode.className = document.querySelector("#numericNavigation").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#keyboardFocusBorderColor").parentNode.className = !document.querySelector("#focusedTileDifferentBorder").checked && !document.getElementById('addFocusedTileDot').checked ? 'disabled-option' : 'enabled-option';
  document.querySelector("#scaleUpFocusedResultAmount").parentNode.className = document.querySelector("#scaleUpFocusedResult").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#focusedTileDotOpacity").parentNode.className = document.querySelector("#addFocusedTileDot").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#hideNumberResultsRowBorder").parentNode.className = document.querySelector("#hideNumberResultsRow").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#sidebarWidth").parentNode.className = document.querySelector("#tryToPlaceWidgetsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#dontProccessWidgetsIfWindowNarrow").parentNode.className = document.querySelector("#tryToPlaceWidgetsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#moveLazyLoadedWidgets").parentNode.className = document.querySelector("#tryToPlaceWidgetsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
  document.querySelector("#moveTopPhotosToSidebar").parentNode.className = document.querySelector("#tryToPlaceWidgetsOnTheSide").checked ? 'enabled-option' : 'disabled-option';
}

function updatePreviewTile() {
  var innerPadding = document.querySelector("#innerPadding").value;
  var hoverTransitionDuration = document.querySelector("#hoverTransitionDuration").value;
  var borderRadius = document.querySelector("#borderRadius").value;
  var borderColor = document.querySelector("#borderColor").value;
  var hoverBackground = document.querySelector("#hoverBackground").value;
  var shadowEnabled = document.querySelector("#shadowEnabled").checked;
  var shadowOpacity = document.querySelector("#shadowOpacity").value;
  var focusedBorderWidth = document.querySelector("#focusedBorderWidth").value;
  var addTileCounter = document.querySelector("#addTileCounter").checked;
  var indexHintOpacity = document.querySelector("#indexHintOpacity").value;
  var wholeTileIsClickable = document.querySelector("#wholeTileIsClickable").checked;
  var simplifyDomain = document.querySelector("#simplifyDomain").checked;
  var widerTiles = document.querySelector("#widerTiles").checked;
  var addTileBorder = document.querySelector("#addTileBorder").checked;
  var tileBackgroundColor = !document.querySelector("#addTileBackground").checked ? 'transparent' : document.querySelector("#tileBackgroundColor").value;
  var highlightTitleOnHover = document.querySelector("#highlightTitleOnHover").checked;
  var titleHoverColor = document.querySelector("#titleHoverColor").value;
  var disableTitleUnderlineOnHover = document.querySelector("#disableTitleUnderlineOnHover").checked;
  // var numbersNavigateTabs = document.querySelector("#numbersNavigateTabs").checked;
  var numericNavigation = document.querySelector("#numericNavigation").checked;
  var showFullDomainOnHover = document.querySelector("#showFullDomainOnHover").checked;
  var colorizeBorderAfterFavicon = document.querySelector("#colorizeBorderAfterFavicon").checked;
  let tileBackgroundOpacity = document.querySelector("#tileBackgroundOpacity").value;
  let tileHoverBackgroundOpacity = document.querySelector("#tileHoverBackgroundOpacity").value;
  let changeCursorOverTile = document.querySelector("#changeCursorOverTile").checked;

  if (tileBackgroundColor !== 'transparent') {
    let color = hexToRgb(tileBackgroundColor);
    tileBackgroundColor = `rgba(${color.red}, ${color.green}, ${color.blue},${tileBackgroundOpacity})`;
  }

  let hColor = hexToRgb(hoverBackground);
  hoverBackground = `rgba(${hColor.red}, ${hColor.green}, ${hColor.blue}, ${tileHoverBackgroundOpacity})`;

  /// Set preview tile style
  var tile = document.querySelector('#previewTile');
  tile.setAttribute("style", `background-color:${tileBackgroundColor};align-items: center;width: ${widerTiles ? 100 : 85}%;cursor:${wholeTileIsClickable && changeCursorOverTile ? 'pointer' : 'auto'};border:solid ${focusedBorderWidth || '1'}px ${addTileBorder ? (colorizeBorderAfterFavicon ? '#4A96F5' : (borderColor ?? '#DADCE0')) : 'transparent'};border-radius: ${borderRadius || '6'}px;transition:all ${hoverTransitionDuration || '300'}ms ease-out;padding: ${innerPadding || '12'}px;box-shadow: ${(shadowEnabled ?? true) ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity || '0.15'})` : 'unset'};`);
  tile.style.width = '96%';

  /// Change favicon and counter hint visibility
  document.querySelector('#previewCounter').style.visibility = addTileCounter == false || numericNavigation == false ? 'collapse' : 'visible';
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
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        setTimeout(function () {
          content.style.overflow = 'visible';
        }, 200);
      }
    });
  }
}

function saveAllOptions() {
  chrome.storage.local.set(userConfigs);
}


function resetOptions() {
  chrome.storage.local.set(configs);
  restoreOptions();
}

function setVersionLabel() {
  let label = document.getElementById('google-tiles-version');
  var manifestData = chrome.runtime.getManifest();
  label.innerHTML = 'Google Tweaker ' + manifestData.version + ` (<a target='_blank' href='https://github.com/emvaized/google-tiles-extension/blob/master/CHANGELOG.md'>${chrome.i18n.getMessage("whatsNew") ?? "What's new"}</a>)`;
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
  } : null;
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("reset", resetOptions);
document.querySelector("#donateButton").addEventListener("click", function (val) {
  window.open('https://ko-fi.com/emvaized', '_blank');
});
document.querySelector("#githubButton").addEventListener("click", function (val) {
  window.open('https://github.com/emvaized/google-tiles-extension', '_blank');
});
document.querySelector("#writeAReviewButton").addEventListener("click", function (val) {
  let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
  window.open(isFirefox ? 'https://addons.mozilla.org/ru/firefox/addon/google-tiles/' : 'https://chrome.google.com/webstore/detail/google-tiles/cjbgjibpaopnjfbhipjfckeodbaednbg/reviews', '_blank');
});