/// Settings
var enabled;
var innerPadding;
var externalPadding;
var hoverTransitionDuration;
var borderRadius;
var hoverBackground;
var shadowEnabled;
var shadowOpacity;
var moveSuggestionsToBottom;
var tryToPlaceWidgetsOnTheSide;
var addFavicons;
var faviconRadius;
var navigateWithKeyboard;
var keyboardCycle;
var keyboardFocusBorderColor;
var focusedBorderWidth;
var numericNavigation;
var addTileCounter;
var indexHintOpacity;
var wholeTileIsClickable;
var applyStyleToWidgets;
var simplifyDomain;
var countedHintColor = 'grey';
var counterHintFocusColor = 'red';

/// CSS selectors
var searchResultsSelector = `[class='g'],[id='wp-tabs-container']`;
var searchFieldClearButtonSelector = `[class^= 'clear-button']`;
var searchFieldSelector = `[name = 'q']`;
var resultStatsSelector = `[id='result-stats']`;
var navBarSelector = `[id='top_nav']`;
var domainNameSelector = `cite`;
var dropdownMenuSelector = `[class='action-menu']`;
var translatePageButtonSelector = `[class*='fl ']`;
var quickAnswerCardId = 'wp-tabs-container';

var genericQuickAnswerCardClass = 'card-section';
var translateWidgetSelector = '#tw-container';
var imageResultsSelector = 'g-section-with-header';
var weatherResultsSelector = '#wob_wc';
var columnWithRegularResultsSelector = '#center_col';
var videoResultsSelector = `[class*=' xpd ']`;
var summaryInfoResultSelector = `[class='OlejJc']`;
var dictionaryWidgetSelector = `[class*='obcontainer']`;
var mapWidgetSelector = `[class='AEprdc vk_c']`;
var advertisementSelectors = '#tvcap, .cu-container';
var peopleAlsoSearchForSelector = '#botstuff'; /// Currently disabled
var knowledgeBaseAnswerSelector = `[class$='g-blk']`;


var focusedTile = 0;
var counterHints = [];

function init() {

  var elements = document.querySelectorAll(searchResultsSelector);

  chrome.storage.local.get([
    'innerPadding',
    'externalPadding',
    'tilesEnabled',
    'hoverTransitionDuration',
    'borderRadius',
    'hoverBackground',
    'shadowEnabled',
    'shadowOpacity',
    'moveSuggestionsToBottom',
    'addFavicons',
    'navigateWithKeyboard',
    'keyboardFocusBorderColor',
    'keyboardCycle',
    'focusedBorderWidth',
    'numericNavigation',
    'addTileCounter',
    'indexHintOpacity',
    'wholeTileIsClickable',
    'faviconRadius',
    'tryToPlaceSuggestionsOnTheSide',
    'applyStyleToWidgets',
    'simplifyDomain'
  ], function (value) {

    enabled = value.tilesEnabled ?? true;
    innerPadding = value.innerPadding || 12;
    externalPadding = value.externalPadding || 24;
    hoverTransitionDuration = value.hoverTransitionDuration || 75;
    borderRadius = value.borderRadius ?? 12;
    hoverBackground = value.hoverBackground || '#f0f2f4';
    shadowEnabled = value.shadowEnabled ?? true;
    shadowOpacity = value.shadowOpacity || 0.15;
    moveSuggestionsToBottom = value.moveSuggestionsToBottom ?? true;
    addFavicons = value.addFavicons ?? true;
    faviconRadius = value.faviconRadius || 12;
    navigateWithKeyboard = value.navigateWithKeyboard ?? true;
    keyboardFocusBorderColor = value.keyboardFocusBorderColor ?? '#210DAB';
    keyboardCycle = value.keyboardCycle ?? true;
    focusedBorderWidth = value.focusedBorderWidth || 1;
    numericNavigation = value.numericNavigation ?? true;
    addTileCounter = value.addTileCounter ?? true;
    indexHintOpacity = value.indexHintOpacity || 0.5;
    wholeTileIsClickable = value.wholeTileIsClickable ?? true;
    tryToPlaceWidgetsOnTheSide = value.tryToPlaceSuggestionsOnTheSide ?? true;
    applyStyleToWidgets = value.applyStyleToWidgets ?? false;
    simplifyDomain = value.simplifyDomain ?? false;

    if (enabled)
      setLayout(elements);
  });
}

function setLayout(elements) {

  /// Display search results first
  if (moveSuggestionsToBottom || tryToPlaceWidgetsOnTheSide || applyStyleToWidgets) {

    /// Card with info from wikipedia on the right side
    var bigSideCard;

    /// Proccess elements
    var elements_array = Array.prototype.slice.call(elements);
    var elements_array_reversed = elements_array.reverse();

    elements_array_reversed.forEach(function (item) {
      /// Don't move big side card with quick answer on top
      if (item.id == quickAnswerCardId) {
        bigSideCard = item;
      }

      if (moveSuggestionsToBottom && item.id !== quickAnswerCardId && !item.className.includes(genericQuickAnswerCardClass))
        document.getElementById('rso').prepend(item);
    });

  }

  if (tryToPlaceWidgetsOnTheSide || applyStyleToWidgets) {
    /// If page contains 'quick answer', like currency conversion widget, move it to the right side

    /// TODO: 
    /// Rewrite the selector in order to select all children except regular search results (like 'div:not(.g)').
    /// This way code will not depend on bunch of selectors for each type of 'quick answer' card
    var quickAnswers = document.querySelectorAll(`${knowledgeBaseAnswerSelector},[class^='${genericQuickAnswerCardClass}'],${mapWidgetSelector},${advertisementSelectors},${summaryInfoResultSelector},${videoResultsSelector},${dictionaryWidgetSelector},${translateWidgetSelector}, ${imageResultsSelector},${weatherResultsSelector}`);

    var sidebarContainer;
    if (bigSideCard !== null && bigSideCard !== undefined) {
      /// if there's big side answer card (usually containing info from Wikipedia), append after it
      var divContainer = document.createElement('div');
      divContainer.setAttribute("style", `margin-top: 35px !important;`);

      sidebarContainer = divContainer;
      bigSideCard.parentNode.appendChild(sidebarContainer);
    } else {
      /// Otherwise, just append it to the right of main results column
      var divContainer = document.createElement('div');
      divContainer.setAttribute("id", "google-tiles-sidebar");
      divContainer.setAttribute("style", `position: absolute; top: 0; right:-109%;min-width: 90%; max-width: 100%;`);

      sidebarContainer = divContainer;
      document.querySelector(columnWithRegularResultsSelector).appendChild(sidebarContainer);
    }

    quickAnswers.forEach(function (suggestionTile) {

      if (suggestionTile.innerHTML == '') {
        suggestionTile.remove();
      }

      if (suggestionTile.innerHTML !== '') {
        if (suggestionTile.tagName !== imageResultsSelector.toUpperCase()) {
          suggestionTile.setAttribute("style", `margin-bottom: ${externalPadding}px;`);
        }

        var index = Array.prototype.indexOf.call(quickAnswers, suggestionTile);
        /// Don't proccess last 2 elements, which are 'search related' items
        if (index !== quickAnswers.length - 1 && index !== quickAnswers.length - 2) {
          if (applyStyleToWidgets)
            configureTile(suggestionTile);
          if (tryToPlaceWidgetsOnTheSide)
            sidebarContainer.appendChild(suggestionTile);
        }

        /// Code to add separator lines when styling is disabled
        // if (applyStyleToWidgets && index !== quickAnswers.length - 1) {
        //   var separatorLine = document.createElement('hr');
        //   separatorLine.setAttribute('style', 'color: grey; opacity: 0.15; margin-bottom: 5px;');
        //   suggestionTile.prepend(separatorLine);
        // }

      }
    });

  }

  /// Add '0' index hint for search field
  if (addTileCounter && numericNavigation) {
    var zeroCounter = document.createElement('p');
    zeroCounter.setAttribute("style", `color: ${countedHintColor};opacity: ${indexHintOpacity}; margin-right: 15px; transition: all 300ms ease-out`);
    zeroCounter.innerHTML = '0';
    counterHints.push(zeroCounter);
    document.querySelector(searchFieldClearButtonSelector).prepend(zeroCounter);
  }

  /// Set tiles for each search result  
  elements.forEach(function (divChild) {
    /// Add index hint
    if (addTileCounter && numericNavigation) {
      var counter = document.createElement('p');
      counter.setAttribute("style", `color: ${countedHintColor};opacity: ${indexHintOpacity};position:absolute; top: -12px; right: 0px;transition: all 300ms ease-out`);
      var i = Array.prototype.indexOf.call(elements, divChild) + 1;
      counter.textContent = i;
      if (i < 10) {
        counterHints.push(counter);

        if (divChild.id == quickAnswerCardId) {
          counter.style.right = '12px';
          counter.style.top = '-3px';
          divChild.appendChild(counter);
        } else {
          divChild.querySelector('a').appendChild(counter);
        }
      }

    }

    /// Apply tile styling
    if (!divChild.className.includes(genericQuickAnswerCardClass))
      try {
        configureTile(divChild);
      } catch (error) { console.log(error); }
  });



  if (navigateWithKeyboard || numericNavigation) {
    document.onkeydown = checkKey;

    if (navigateWithKeyboard) elements[0].parentNode.focus();

    var searchField = document.querySelector(searchFieldSelector);

    function checkKey(e) {
      /// Dont listen for number or arrow keys when searchfield is focused
      if (document.activeElement === searchField) return;

      e = e || window.event;

      /// Arrow keys navigation
      if (navigateWithKeyboard) {
        if (e.keyCode == '38') {
          /// up arrow
          e.preventDefault();
          focusPreviousTile();
        } else if (e.keyCode == '40') {
          /// down arrow
          e.preventDefault();
          focusNextTile();
        } else if (e.keyCode == '37') {
          /// left arrow
          e.preventDefault();
          focusFirstTile();
        } else if (e.keyCode == '39') {
          /// right arrow
          e.preventDefault();
          focusLastTile();
        }
      }

      /// Numeric keyboard focus
      if (numericNavigation) {

        const parsed = parseInt(e.key, 10);
        if (isNaN(parsed)) { return; }

        if (parsed == 0) {
          /// Focus the search field
          e.preventDefault();

          searchField.focus();

          /// select all text in text field
          searchField.setSelectionRange(0, searchField.value.length);

          /// Animate color of hint
          animateCounterFocus(0);
        } else {
          /// Focus search result at number
          e.preventDefault();
          focusedTile = parsed - 1;
          elements[parsed - 1].parentNode.focus();
          animateCounterFocus(parsed);
        }
      }
    }

    function animateCounterFocus(index) {
      counterHints[index].style.color = counterHintFocusColor;
      counterHints[index].style.opacity = 1.0;
      setTimeout(function () {
        counterHints[index].style.color = countedHintColor;
        counterHints[index].style.opacity = indexHintOpacity;
      }, 300);
    }



    function focusPreviousTile() {
      if (focusedTile > 0) {
        focusedTile -= 1;
        elements[focusedTile].parentNode.focus();
      } else {
        if (keyboardCycle) {
          focusLastTile();
        }
      }
    }

    function focusNextTile() {
      if (focusedTile < elements.length - 1) {
        focusedTile += 1;
        elements[focusedTile].parentNode.focus();
      } else {
        if (keyboardCycle) {
          focusFirstTile();
        }
      }
    }

    function focusFirstTile() {
      focusedTile = 0;
      elements[focusedTile].parentNode.focus();
    }

    function focusLastTile() {
      focusedTile = elements.length - 1;
      elements[focusedTile].parentNode.focus();
    }
  }
}


function configureTile(tile) {
  /// Create 'a' wrapper
  var wrapper = document.createElement('a');
  // wrapper.setAttribute("style", "outline: none !important;text-decoration: none !important;color: transparent !important;");
  wrapper.setAttribute("style", "outline: none !important;text-decoration: none !important;");

  var table = document.querySelector('table');
  if (table !== null && table !== undefined) {
    table.setAttribute('style', 'text-decoration: none !important; color:transparent !important');
  }

  /// Set url for 'a' wrapper
  var url;
  if (tile.id == quickAnswerCardId) {
    /// For 'quick answer' card on the right, try to use 'wikipedia' link
    var links = tile.querySelectorAll('a');

    links.forEach(function (link) {
      if (link.href.includes('wikipedia')) url = link.href;
    });
    if (url === undefined) url = tile.querySelector('a').href;

  } else {
    /// For regular search result, use first found link inside html element
    url = tile.querySelector('a').href;
  }
  wrapper.href = url;

  /// Add default style for tile
  tile.setAttribute("style", `border:solid ${focusedBorderWidth}px transparent;border-radius: ${borderRadius}px;transition:all ${hoverTransitionDuration}ms ease-out;padding: ${innerPadding}px;margin: 0px 0px ${tile.tagName === 'G-INNER-CARD' ? '0px' : externalPadding}px;box-shadow: ${shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})` : 'unset'};`);


  /// Adding the same padding for 'results count' text on and navbar for better visual symmetry
  var resultStats = document.querySelector(resultStatsSelector);
  if (resultStats !== null)
    resultStats.setAttribute("style", `padding: 0px ${innerPadding}px;`);
  var navBar = document.querySelector(navBarSelector);
  if (navBar !== null)
    navBar.setAttribute("style", `padding: 0px ${innerPadding}px;`);

  /// Set 'on hover' styling for each tile
  tile.onmouseover = function () { this.style.backgroundColor = hoverBackground; }
  tile.onmouseout = function () { this.style.backgroundColor = "transparent"; }

  if (navigateWithKeyboard || numericNavigation) {
    /// Highlight item focused with keyboard
    wrapper.addEventListener('focus', (event) => {
      wrapper.firstChild.style.border = `solid ${focusedBorderWidth}px ${keyboardFocusBorderColor}`;
    });

    /// Remove the highlight from item on focus loss
    wrapper.addEventListener("blur", (e) => {
      wrapper.firstChild.style.border = `solid ${focusedBorderWidth}px transparent`;
    });
  }


  if (shadowEnabled && wholeTileIsClickable) {
    /// Append onClick listeners to visually emulate button press on card by changing shadow 
    tile.onmousedown = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity / 2})`;
    }

    tile.onmouseup = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})`;
    }
  }

  /// Wrap element with 'a' created element
  if (wholeTileIsClickable)
    tile.wrap(wrapper);


  /// Add favicons to website titles
  if (addFavicons || simplifyDomain) {
    var domain = tile.querySelector(domainNameSelector);

    if (domain != null) {

      /// Replace domain with simplier version
      if (simplifyDomain) {
        try {
          var titleText = domain.textContent.replace(/.+\/\/|www.|\..+/g, '');
          domain.setAttribute('title', domain.textContent);
          domain.innerHTML = titleText + domain.querySelector('span').innerHTML;
        } catch (error) { console.log(error); }
      }

      if (addFavicons) {
        /// Create favicon
        var favicon = document.createElement('img');
        favicon.setAttribute("src", 'https://www.google.com/s2/favicons?domain=' + url);
        favicon.style.cssText = `height:${faviconRadius}px; width:${faviconRadius}px;  padding-right: 5px;`;
        domain.parentNode.prepend(favicon);

        /// Fix dropdown button position
        var dropdownMenu = tile.querySelector(dropdownMenuSelector);
        if (dropdownMenu != null) {
          // dropdownMenu.style.cssText = `padding-left: 3px;position: relative; left: ${faviconRadius}px`;
          domain.appendChild(dropdownMenu);
        }

        /// Fix 'translate page' button position
        var translatePageButton = tile.querySelector(translatePageButtonSelector);
        if (translatePageButton != null) {
          translatePageButton.style.cssText = `margin-left: 6px;`;
          if (dropdownMenu != null) {
            dropdownMenu.appendChild(translatePageButton);
          }
          else {
            domain.appendChild(translatePageButton);
          }
          // translateButton.style.cssText = `margin-left: 3px;position: relative; left: ${faviconRadius}px`;
        }
      }


    }
  }


}

HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  wrapper.appendChild(this);
}

init();




