var enabled;
var innerPadding;
var externalPadding;
var hoverTransitionDuration;
var borderRadius;
var hoverBackground;
var shadowEnabled;
var shadowOpacity;
var moveSuggestionsToBottom;
var addFavicons;
var faviconRadius;
var navigateWithKeyboard;
var keyboardCycle;
var keyboardFocusBorderColor;
var focusedBorderWidth;
var numericNavigation;
var addTileCounter;
var counterHintFocusColor = 'red';

var focusedTile = 0;


HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  wrapper.appendChild(this);
}

function configureTile(element) {
  /// Create 'a' wrapper
  var wrapper = document.createElement('a');
  wrapper.setAttribute("style", "outline: none !important;text-decoration: none !important;color: transparent;");

  /// Set url for 'a' wrapper
  var url;
  if (element.id == 'wp-tabs-container') {
    /// For 'quick answer' card on the right, try to use 'wikipedia' link
    var links = element.querySelectorAll('a');

    links.forEach(function (link) {
      if (link.href.includes('wikipedia')) url = link.href;
    });
    if (url === undefined) url = element.querySelector('a').href;

  } else {
    /// For regular search result, use first found link inside html element
    url = element.querySelector('a').href;
  }
  wrapper.href = url;

  /// Add default style for tile
  element.setAttribute("style", `border:solid ${focusedBorderWidth}px transparent;border-radius: ${borderRadius}px;transition:all ${hoverTransitionDuration}ms ease-out;padding: ${innerPadding}px;margin: 0px 0px ${element.tagName === 'G-INNER-CARD' ? '0px' : externalPadding}px;box-shadow: ${shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})` : 'unset'};`);

  /// Adding the same padding for 'results count' text on and navbar for better visual symmetry
  document.getElementById('result-stats').setAttribute("style", `padding: 0px ${innerPadding}px;`);
  document.getElementById('top_nav').setAttribute("style", `padding: 0px ${innerPadding}px;`);

  /// Limiting max height for news cards
  if (element.tagName === 'G-INNER-CARD') {
    element.style.maxHeight = '200px';
  }

  /// Set 'on hover' styling for each tile
  element.onmouseover = function () { this.style.backgroundColor = hoverBackground; }
  element.onmouseout = function () { this.style.backgroundColor = "transparent"; }

  if (navigateWithKeyboard || numericNavigation) {
    /// Highlight item focused with keyboard

    wrapper.addEventListener('focus', (event) => {
      // wrapper.firstChild.style.background = hoverBackground;
      wrapper.firstChild.style.border = `solid ${focusedBorderWidth}px ${keyboardFocusBorderColor}`;
    });

    /// Remove the highlight from item on focus loss
    wrapper.addEventListener("blur", (e) => {
      // wrapper.firstChild.style.background = 'transparent';
      wrapper.firstChild.style.border = `solid ${focusedBorderWidth}px transparent`;
    });
  }


  if (shadowEnabled) {
    /// Append onClick listeners to visually emulate button press on card by changing shadow 
    element.onmousedown = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity / 2})`;

    }

    element.onmouseup = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})`;
    }
  }




  /// Wrap element with 'a' created element
  element.wrap(wrapper);


  /// Add favicons to website titles
  if (addFavicons) {
    var websiteTitle = element.querySelector(`cite`);
    var favicon = document.createElement('img');
    favicon.setAttribute("src", 'https://www.google.com/s2/favicons?domain=' + url);
    favicon.style.cssText = `height:${faviconRadius}px; width:${faviconRadius}px;  padding-right: 5px;`;

    if (websiteTitle != null) {
      websiteTitle.parentNode.prepend(favicon);

      /// Shift dropdown button to the right
      var dropdownMenu = element.querySelector(`[class='action-menu']`);
      if (dropdownMenu != null)
        dropdownMenu.style.cssText = `padding-left: 3px;position: relative; left: ${faviconRadius}px`;
    }
  }
}
var counterHints = [];

function setTiles(elements) {

  /// Display search results first
  if (moveSuggestionsToBottom) {
    var elements_array = Array.prototype.slice.call(elements);
    var elements_array_reversed = elements_array.reverse();

    elements_array_reversed.forEach(function (item) {
      /// Don't move suggestion cards with tag name 'g-inner-card' on top
      if (item !== elements_array_reversed[0] && item.tagName !== 'G-INNER-CARD')
        document.getElementById('rso').prepend(item);
    });
  }

  /// Add text field '0' hint
  if (addTileCounter) {
    var zeroCounter = document.createElement('p');
    zeroCounter.setAttribute("style", "color: grey;opacity: 0.7; margin-right: 15px; transition: all 200ms ease-out");

    zeroCounter.innerHTML = '0';
    // counterHints[0] = zeroCounter;
    counterHints.push(zeroCounter);

    document.querySelector(`[class^= 'clear-button']`).prepend(zeroCounter);

  }

  /// Set tiles for each search result  
  elements.forEach(function (divChild) {
    /// Add tile counter
    if (addTileCounter) {
      var counter = document.createElement('p');
      counter.setAttribute("style", "color: grey;opacity: 0.7;position:absolute; top: -12px; right: 0px;transition: all 200ms ease-out");
      var i = Array.prototype.indexOf.call(elements, divChild) + 1;
      counter.innerHTML = i;
      if (i < 10) {
        counterHints.push(counter);

        divChild.querySelector('a').appendChild(counter);
      }

    }

    configureTile(divChild);
  });

  if (navigateWithKeyboard || numericNavigation) {
    document.onkeydown = checkKey;

    if (navigateWithKeyboard) elements[0].parentNode.focus();

    function checkKey(e) {

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
          var inputField = document.querySelector(`[name = 'q']`);
          inputField.focus();
          var val = inputField.value; // /store the value of the element
          inputField.value = ''; /// clear the value of the element
          inputField.value = val;/// assign old value again, to move selection at the end

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
      setTimeout(function () {
        counterHints[index].style.color = 'grey';
      }, 400);
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
      elements[focusedTile].parentNode.scrollIntoView();
    }
  }
}






var elements = document.querySelectorAll(`[class='g'],[id='wp-tabs-container']`);
chrome.storage.local.get(['innerPadding',
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
  'faviconRadius'], function (value) {

    enabled = value.tilesEnabled ?? true;
    innerPadding = value.innerPadding || 12;
    externalPadding = value.externalPadding || 24;
    hoverTransitionDuration = value.hoverTransitionDuration || 75;
    borderRadius = value.borderRadius ?? 6;
    hoverBackground = value.hoverBackground || '#f0f2f4';
    shadowEnabled = value.shadowEnabled ?? true;
    shadowOpacity = value.shadowOpacity || 0.15;
    moveSuggestionsToBottom = value.moveSuggestionsToBottom ?? true;
    addFavicons = value.addFavicons ?? true;
    faviconRadius = value.faviconRadius || 12;
    navigateWithKeyboard = value.navigateWithKeyboard ?? false;
    keyboardFocusBorderColor = value.keyboardFocusBorderColor ?? '#210DAB';
    keyboardCycle = value.keyboardCycle ?? true;
    focusedBorderWidth = value.focusedBorderWidth || 1;
    numericNavigation = value.numericNavigation ?? true;
    addTileCounter = value.addTileCounter ?? true;


    if (enabled)
      setTiles(elements);
  });


