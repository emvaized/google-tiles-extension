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
var widerTiles;
var scaleUpImageResultsOnHover;
var scrollHorizontalViewOnHover;
var addTileBorder;
var tileBackgroundColor;
var delayToScrollOnHover;
var numbersNavigateTabs;
var disableTitleUnderlineOnHover;
var showFullDomainOnHover;
var highlightTitleOnHover;
var titleHoverColor;
var addTileBackground;
var borderColor;
var sidebarWidthMultiplier;
var firstNumberPressScrollsToElement;
var sideArrowsFocusSidebarFirst;
var colorizeBorderAfterFavicon;
var focusedTileDifferentBorder;
var scaleUpFocusedResult;
var scaleUpFocusedResultAmount;

var sidebarPadding = 25;
var centerizeSelectedResult = true;
var imageScaleUpOnHoverAmount = 1.5;
var loadPreviews = false;
var counterHintsOnBottom = true;
var countedHintColor = 'grey';
var counterHintFocusColor = '#EA4335';

/// CSS selectors
var regularResultClassName = 'g';
var searchFieldSelector = `[name = 'q']`;
var resultStatsSelector = `[id='result-stats']`;
var navBarSelector = `[id='top_nav']`;
var domainNameSelector = `cite`;
var dropdownMenuSelector = `[class='action-menu']`;
var translatePageButtonSelector = `[class*='fl ']`;
var columnWithRegularResultsId = 'rso';
var columnWithImagePageResultsId = 'islrg';
var peopleAlsoSearchForId = 'botstuff';
var imageResultTileSelector = `[class$='ivg-i']`;
var imageCarouselClass = 'GNxIwf';
var interactiveWidgetSelector = `[class$='vk_c']`;
var nextResultsPageButtonId = 'pnnext';
var previousResultsPageButtonId = 'pnprev';

var scrollableCardSelector = `g-inner-card`;
var imagesPageImageSelector = `[class*='rg_i']`;
var newsPageCardSelector = 'g-card';
var shopPageCardClass = 'sh-dlr__list-result';
var regularCategoryButtonsParentSelector = '#hdtb-msb';
var regularCategoryButtonsParentId = 'hdtb-msb';
var regularCategoryButtonSelector = '.hdtb-mitem';
var imagesPageCategoryButtonsParentSelector = '.T47uwc';
var imagesPageCategoryButtonSelector = `[class*='NZmxZe']`;

function init() {

  chrome.storage.local.get(
    [
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
      'simplifyDomain',
      'widerTiles',
      'scaleUpImageResultsOnHover',
      'scrollHorizontalViewOnHover',
      'addTileBorder',
      'tileBackgroundColor',
      'delayToScrollOnHover',
      'numbersNavigateTabs',
      'disableTitleUnderlineOnHover',
      'showFullDomainOnHover',
      'highlightTitleOnHover',
      'titleHoverColor',
      'addTileBackground',
      'borderColor',
      'sidebarWidthMultiplier',
      'firstNumberPressScrollsToElement',
      'sideArrowsFocusSidebarFirst',
      'colorizeBorderAfterFavicon',
      'focusedTileDifferentBorder',
      'scaleUpFocusedResult',
      'scaleUpFocusedResultAmount',
    ], function (value) {
      enabled = value.tilesEnabled ?? true;

      if (enabled) {

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
        applyStyleToWidgets = value.applyStyleToWidgets ?? true;
        simplifyDomain = value.simplifyDomain ?? true;
        widerTiles = value.widerTiles ?? true;
        scaleUpImageResultsOnHover = value.scaleUpImageResultsOnHover ?? true;
        scrollHorizontalViewOnHover = value.scrollHorizontalViewOnHover ?? true;
        addTileBorder = value.addTileBorder ?? true;
        tileBackgroundColor = value.tileBackgroundColor ?? '#FFFFFF';
        delayToScrollOnHover = value.delayToScrollOnHover || 150;
        numbersNavigateTabs = value.numbersNavigateTabs ?? true;
        disableTitleUnderlineOnHover = value.disableTitleUnderlineOnHover ?? true;
        showFullDomainOnHover = value.showFullDomainOnHover ?? true;
        highlightTitleOnHover = value.highlightTitleOnHover ?? false;
        titleHoverColor = value.titleHoverColor || '#EA4335';
        addTileBackground = value.addTileBackground ?? true;
        borderColor = value.borderColor || '#DADCE0';
        sidebarWidthMultiplier = value.sidebarWidthMultiplier || 0.75;
        firstNumberPressScrollsToElement = value.firstNumberPressScrollsToElement ?? true;
        sideArrowsFocusSidebarFirst = value.sideArrowsFocusSidebarFirst ?? true;
        colorizeBorderAfterFavicon = value.colorizeBorderAfterFavicon ?? false;
        focusedTileDifferentBorder = value.focusedTileDifferentBorder ?? true;
        scaleUpFocusedResult = value.scaleUpFocusedResult ?? false;
        scaleUpFocusedResultAmount = value.scaleUpFocusedResultAmount || 1.05;

        var mainResults = document.getElementById(columnWithRegularResultsId);
        if (mainResults !== null) {
          /// Regular results handling
          mainResults = Array.prototype.slice.call(mainResults.children);

          /// Handling when cards are wrapped in div (for example, in Edge)
          if (mainResults.length < 8)
            mainResults.forEach(function (result) {
              var ch = result.children;
              ch = Array.prototype.slice.call(ch);

              if (ch !== null && ch !== undefined && ch !== []) {
                var regularResultsColumnElement = document.getElementById(columnWithRegularResultsId);
                ch.forEach(function (c) {
                  if (c.className == 'g') {
                    mainResults.push(c);
                    regularResultsColumnElement.appendChild(c);
                  }
                })
              }
            })

          /// Special handling for news results page
          if (mainResults.length == 2) {
            var newsMainResults = mainResults[0].querySelectorAll(newsPageCardSelector);
            newsMainResults = Array.prototype.slice.call(newsMainResults);

            mainResults[1].firstChild.style.cssText = 'overflow-x: auto !important';
            newsMainResults.push(mainResults[1]);
            mainResults = newsMainResults;
          }
          else if (mainResults.length <= 5) {
            /// Special handling for shop page (quite a shaky way to determine - desirably to rewrite)
            var newsMainResults = document.getElementById(columnWithRegularResultsId).querySelectorAll(`.${shopPageCardClass}`);
            newsMainResults = Array.prototype.slice.call(newsMainResults);
            mainResults = newsMainResults;
          }

          setLayout(mainResults);
        } else {
          /// Image page results handling (all proccessing done inside method)

          // var container = document.getElementById('islrg');
          // var images = container.firstChild.children;
          setLayout();
        }
      }
    });
}

function setLayout(elements) {
  var counterHintsList = [];

  var regularResultsColumn = document.getElementById(columnWithRegularResultsId);
  var tiles = elements;
  var sidebarContainer = document.getElementById('rhs');
  if (regularResultsColumn !== null)

    try {
      var regularResultsColumnWidth = regularResultsColumn.clientWidth;

      /// Adjusting sidebar
      if (sidebarContainer == null) {
        sidebarContainer = document.createElement('div');
        sidebarContainer.setAttribute('id', 'g-tiles-sidebar');
        sidebarContainer.setAttribute("style", `position: absolute; top: 0; left:${regularResultsColumnWidth * 1.07 + sidebarPadding}px;width: ${regularResultsColumnWidth * sidebarWidthMultiplier}px !important;padding-left:${sidebarPadding}px;padding-top:0px;`);
        if (regularResultsColumn !== null)
          regularResultsColumn.parentNode.appendChild(sidebarContainer);

        /// Table approach
        // sidebarContainer.setAttribute("style", `width: ${regularResultsColumnWidth * sidebarWidthMultiplier}px !important;margin-left:${sidebarPadding * 5}px;`);
        // var table = document.createElement('table');
        // var tr = document.createElement('tr');
        // var td1 = document.createElement('td');
        // var td2 = document.createElement('td');

        // if (regularResultsColumn !== null) {
        //   regularResultsColumn.wrap(td1);
        //   td1.wrap(tr);
        //   tr.appendChild(sidebarContainer);
        //   sidebarContainer.wrap(td2);
        //   tr.wrap(table);
        // }

      } else
        sidebarContainer.setAttribute("style", `width: ${regularResultsColumnWidth * sidebarWidthMultiplier}px !important;padding-left:${sidebarPadding}px;padding-top:6px;`);


      /// Adding some padding for 'results count' text on and navbar for better visual symmetry
      var resultStats = document.querySelector(resultStatsSelector);
      if (resultStats !== null)
        resultStats.setAttribute("style", `padding: 0px ${innerPadding}px;`);
      var navBar = document.querySelector(navBarSelector);
      if (navBar !== null)
        navBar.setAttribute("style", `padding: 0px ${innerPadding}px;`);

      /// Apply styles for elements already in sidebar
      var sidebarWidgets;
      if (sidebarContainer !== null) {
        sidebarWidgets = sidebarContainer.children;
        sidebarWidgets = Array.prototype.slice.call(sidebarWidgets);

        sidebarWidgets.reverse().forEach(function (item) {
          if (item.clientHeight !== 0.0 && item.clientWidth !== 0.0 && (item.tagName == 'DIV' || item.tagName == 'G-SECTION-WITH-HEADER')) {
            configureTile(item);

            /// For whatever reason these items are always less wide by 5% - fix this:
            item.style.width = '105%';
          }
        });
      }


      /// Add search suggestions div to proccessed elements
      var botstuff = document.getElementById(peopleAlsoSearchForId);
      if (botstuff !== null) {
        tiles.push(botstuff);
      }

      var numericNavigationIndex = 0;

      /// Apply styles for all the other elements
      if (regularResultsColumn !== null)
        tiles.forEach(function (suggestionTile) {
          if (suggestionTile.clientHeight !== 0.0 && suggestionTile.clientWidth !== 0.0 && suggestionTile.firstChild !== undefined) {
            try {

              if (suggestionTile.className !== regularResultClassName) {

                /// If sidebar height won't exceed regular results height, move tile there
                if (sidebarContainer !== null && sidebarContainer.clientHeight + suggestionTile.clientHeight < regularResultsColumn.clientHeight && suggestionTile.className !== shopPageCardClass && suggestionTile.tagName !== newsPageCardSelector.toUpperCase()) {

                  /// Attach widget to sidebar
                  if (tryToPlaceWidgetsOnTheSide)
                    sidebarContainer.appendChild(suggestionTile);
                  else if (moveSuggestionsToBottom)
                    regularResultsColumn.append(suggestionTile);
                  if (applyStyleToWidgets) {
                    configureTile(suggestionTile, regularResultsColumnWidth * sidebarWidthMultiplier);

                    // suggestionTile.style.overflowX = 'auto';
                  }
                } else {
                  /// Otherwise, attach it on bottom of regular results scrollbar
                  if (moveSuggestionsToBottom)
                    regularResultsColumn.append(suggestionTile);

                  if (applyStyleToWidgets) {
                    configureTile(suggestionTile, regularResultsColumnWidth);
                  }
                }
              } else {
                configureTile(suggestionTile);

                /// Add index hint
                if (addTileCounter && numericNavigation && numbersNavigateTabs == false) {
                  var counter = document.createElement('p');
                  counter.setAttribute("style", `color: ${countedHintColor};opacity: ${indexHintOpacity};position:absolute; right: ${innerPadding}px;transition: all 300ms ease-out`);

                  if (counterHintsOnBottom) {
                    counter.style.bottom = '0px';
                  } else {
                    counter.style.top = '0px';
                  }
                  counter.setAttribute('id', 'g-tile-counter-hint');
                  numericNavigationIndex += 1;
                  counter.textContent = numericNavigationIndex;
                  if (numericNavigationIndex < 10) {
                    counterHintsList.push(counter);
                    suggestionTile.appendChild(counter);
                  }
                }
              }
            } catch (error) { console.log('Google Tiles error: ' + error); }


            /// Add scale-up effect for image results
            if (scaleUpImageResultsOnHover) {
              var imageResults = suggestionTile.querySelectorAll(imageResultTileSelector);

              var heightPadding = (imageScaleUpOnHoverAmount - 1.0) / 2;

              if (imageResults !== null && imageResults !== undefined) {
                imageResults.forEach(function (image) {
                  try {
                    var height = image.clientHeight;

                    image.onmouseover = function (event) {
                      this.setAttribute('style', `${image.parentNode.classList.contains(imageCarouselClass) ? `margin: 0px ${height * heightPadding}px;` : ''} -webkit-transform:scale(${imageScaleUpOnHoverAmount}); z-index: 999; transition: all 150ms ease-in-out; box-shadow: 0px 5px 15px rgba(0, 0, 0, ${shadowOpacity}) `);
                    }
                    image.onmouseout = function () {
                      this.setAttribute('style', `-webkit-transform:scale(1.0); z-index: 0; transition: all 150ms ease-in-out;`);
                    }

                    /// If image is inside horizontal carouosel, add padding
                    if (image.parentNode.classList.contains(imageCarouselClass)) {
                      var imageCarouselContainer = image.parentNode;

                      imageCarouselContainer.onmouseover = function (event) {
                        imageCarouselContainer.setAttribute('style', ` margin-bottom: ${height * heightPadding}px;margin-top: ${height * heightPadding}px;transition: all 150ms ease-in-out;`);
                      }
                      imageCarouselContainer.onmouseout = function () {
                        imageCarouselContainer.setAttribute('style', `margin: 0px; transition: all 150ms ease-in-out;`);
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                });
              } else {
                console.log('Google Tiles: no zoomable images found');
              }
            }

            /// Add scroll-on-hover listeners
            if (scrollHorizontalViewOnHover) {

              // var list = suggestionTile.querySelector(`[role='list']`);
              // if (list !== null) {
              // var scrollableCards = Array.prototype.slice.call(list.children);


              // var scrollableCards = suggestionTile.querySelectorAll(scrollableCardSelector);
              var scrollableCards = suggestionTile.querySelectorAll(`[role='listitem'], g-inner-card`);

              if (scrollableCards !== null && scrollableCards !== undefined) {
                /// Try to proccess 'More news' cards on news page
                if (scrollableCards.length == 0)
                  scrollableCards = suggestionTile.querySelectorAll(newsPageCardSelector);

                if (scrollableCards !== null && scrollableCards !== undefined && scrollableCards.length > 0)
                  scrollableCards.forEach(function (card) {

                    card.onmouseover = function (event) {
                      // card.scrollIntoView({ block: 'nearest', inline: "center", behavior: "smooth" });
                      setTimeout(function () {
                        card.scrollIntoView({ block: 'nearest', inline: "center", behavior: "smooth" });
                      }, delayToScrollOnHover);
                    }
                  });
              }

            }
          }
        });


    } catch (error) {
      console.log('Google Tiles error: ' + error)


    }
  else {
    ///Add scale-up effect for image results page
    if (scaleUpImageResultsOnHover) {
      var imageResults = document.querySelectorAll(imagesPageImageSelector);

      if (imageResults !== null && imageResults !== undefined) {
        imageResults.forEach(function (image) {
          image.onmouseover = function (event) {
            this.parentNode.setAttribute('style', `-webkit-transform:scale(${imageScaleUpOnHoverAmount}); z-index: 999; transition: all 150ms ease-in-out; box-shadow: 0px 5px 15px rgba(0, 0, 0, ${shadowOpacity}) `);
            this.parentNode.parentNode.style.overflow = 'visible';
          }
          image.onmouseout = function () {
            this.parentNode.setAttribute('style', `-webkit-transform:scale(1.0); z-index: 0; transition: all 150ms ease-in-out;`);
            setTimeout(function () {
              image.parentNode.parentNode.style.overflow = 'hidden';
            }, 150);
          }

          image.onmousedown = function () {
            this.parentNode.setAttribute('style', `-webkit-transform:scale(1.0); z-index: 0; transition: all 150ms ease-in-out;`);
            setTimeout(function () {
              image.parentNode.parentNode.style.overflow = 'hidden';
            }, 150);
          }

        });
      }
    }
  }

  /// Add '0' index hint for search field
  if (addTileCounter && numericNavigation) {
    try {
      var zeroCounter = document.createElement('span');
      zeroCounter.setAttribute("style", `position: absolute; z-index:0; right: -15px; top: 50%; color: ${countedHintColor};opacity: ${indexHintOpacity}; transition: all 300ms ease-in-out`);
      zeroCounter.innerHTML = '0';
      counterHintsList.push(zeroCounter);

      var searchField = document.querySelector('button').parentNode.parentNode;
      searchField.appendChild(zeroCounter);
    } catch (error) { console.log(error); }
  }


  /// Set keyboard listeners
  if (navigateWithKeyboard || numericNavigation) {
    document.onkeydown = checkKey;
    var searchField = document.querySelector(searchFieldSelector);
    var averageRegularResultsPerWidget = 3.5;

    var sideBarIsFocused = false;
    var focusedRegularResult = 0;
    var focusedSidebarWidget = 0;

    var currentTabIndex;

    if (regularResultsColumn !== null)
      var regularSearchResults = regularResultsColumn.querySelectorAll('#g-tile');
    if (sidebarContainer !== null)
      var sidebarSearchResults = sidebarContainer.querySelectorAll('#g-tile');

    if (navigateWithKeyboard && regularSearchResults !== undefined && regularSearchResults[0] !== undefined) regularSearchResults[0].focus();

    /// Value used for arrow keys navigation
    var sidebarContainsWidgets = false;

    /// If sidebar's fist item is bigger then 2 regular search results, then sidebar contains widgets 
    if (sidebarSearchResults !== null && sidebarSearchResults !== undefined) {
      var firstItem = sidebarSearchResults.item(0);
      if (firstItem !== null)
        var c = firstItem.firstChild;
      if (c !== null && c !== undefined) {
        var height = c.clientHeight;
        if (regularSearchResults.item(0) !== null && height > regularSearchResults.item(0).firstChild.clientHeight * 2)
          sidebarContainsWidgets = true;
      }
    }

    /// Attach index hints to tab categories when numeric tab navigation is enabled
    if (numericNavigation && numbersNavigateTabs) {
      var tabButtons;
      // var topBar = document.querySelector(regularCategoryButtonsParentSelector);
      var topBar = document.getElementById(regularCategoryButtonsParentId);

      /// Some experiments to place category buttons near to searchbox
      // document.querySelector('sfbg').appendChild(topBar.firstChild);
      // topBar.firstChild.setAttribute('style', 'position: absolute;right: 0px; top: 0px;');

      if (topBar == null) {
        /// Selectors for 'images' tab
        topBar = document.querySelector(imagesPageCategoryButtonsParentSelector);
        tabButtons = topBar.querySelectorAll(imagesPageCategoryButtonSelector);
        tabButtons = Array.prototype.slice.call(tabButtons);
      } else
        tabButtons = topBar.querySelectorAll(regularCategoryButtonSelector);

      if (tabButtons !== null) {
        for (i in tabButtons) {
          if (i > 5) break;
          var item = tabButtons[i];
          if (item.tagName == undefined) continue;
          if (item.classList.length > 1 && currentTabIndex == null) {
            currentTabIndex = i;
          } else {
            if (addTileCounter)
              try {
                var counter = document.createElement('p');
                counter.setAttribute("style", `color: ${countedHintColor};opacity: ${indexHintOpacity};position:absolute;top:0px;left: 0px;transition: all 300ms ease-out`);
                counter.setAttribute('id', 'g-tile-counter-hint');
                counter.textContent = parseInt(i) + 1;
                counterHintsList.push(counter);

                item.setAttribute('style', 'position: relative');
                item.appendChild(counter);
              } catch (error) {
                console.log(error);
              }
          }
        }
      }
    }

    function checkKey(e) {
      /// Dont listen for number or arrow keys when searchfield is focused
      if (document.activeElement === searchField) return;

      e = e || window.event;

      /// Arrow keys navigation
      if (navigateWithKeyboard && regularResultsColumn !== null) {


        if (e.keyCode == '38') {
          /// up arrow
          e.preventDefault();
          focusPreviousSearchResult();
        } else if (e.keyCode == '40') {
          /// down arrow
          e.preventDefault();
          focusNextSearchResult();
        } else if (e.keyCode == '37') {
          /// left arrow
          e.preventDefault();

          if (sidebarSearchResults !== null && sidebarSearchResults.length !== 0 && sideArrowsFocusSidebarFirst) {
            if (sideBarIsFocused == false)
              goToPreviousPage();
            else
              switchToRegularResults();
          } else {
            // focusFirstTile();
            goToPreviousPage();
          }

        } else if (e.keyCode == '39') {
          /// right arrow
          e.preventDefault();

          if (sidebarSearchResults !== null && sidebarSearchResults.length !== 0 && sideArrowsFocusSidebarFirst) {
            if (sideBarIsFocused)
              goToNextPage();
            else
              switchToSideBar();
          } else {
            // focusLastTile();
            goToNextPage();
          }
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

          if (numbersNavigateTabs) {
            /// Don't handle buttons beyond the 'more' - they are too tricky
            if (parsed - 1 > 5) return;

            var button = tabButtons[parsed - 1];

            var isVisible;

            if (firstNumberPressScrollsToElement) {
              isVisible = isElementPartiallyInViewport(button);
            }

            if (isVisible || firstNumberPressScrollsToElement == false) {
              animateCounterFocus(parsed <= currentTabIndex ? parsed : parsed - 1);
              setTimeout(function () {
                /// Click through some button elements 
                /// On different search pages different button's element respond to click - these set covers almost all of them
                button.click();
                button.firstChild.click();
                button.querySelector('span').click();
              }, 100);
            } else {
              button.scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
            }


          } else {
            focusedRegularResult = parsed - 1;
            var resultToFocus = regularSearchResults[parsed - 1];
            if (firstNumberPressScrollsToElement == false || document.activeElement === resultToFocus) {
              animateCounterFocus(parsed - 1);
              resultToFocus.focus();
              resultToFocus.click();
            } else {
              resultToFocus.focus();
              resultToFocus.scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
            }

          }
        }
      }
    }


    function goToPreviousPage() {
      var prevPageButton = document.getElementById(previousResultsPageButtonId);
      if (prevPageButton !== null)
        prevPageButton.click();
    }

    function goToNextPage() {
      var nextPageButton = document.getElementById(nextResultsPageButtonId);
      if (nextPageButton !== null)
        nextPageButton.click();
    }

    function isElementPartiallyInViewport(el) {
      var rect = el.getBoundingClientRect();
      // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
      var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
      var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

      // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
      var vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
      var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

      return (vertInView && horInView);
    }

    function animateCounterFocus(index) {
      counterHintsList[index].style.color = counterHintFocusColor;
      counterHintsList[index].style.opacity = 1.0;
      setTimeout(function () {
        counterHintsList[index].style.color = countedHintColor;
        counterHintsList[index].style.opacity = indexHintOpacity;
      }, 300);
    }

    function switchToRegularResults() {
      sideBarIsFocused = false;

      if (sidebarContainsWidgets) {
        /// Correct the index to reduce window scroll position jumps
        var indexToFocus = Math.round(focusedSidebarWidget + (focusedSidebarWidget * averageRegularResultsPerWidget));
        focusedRegularResult =
          indexToFocus > regularSearchResults.length - 1 ?
            regularSearchResults.length - 1 :
            // indexToFocus == 0 ? Math.round(averageRegularResultsPerWidget / 2) : 
            indexToFocus;
      } else {
        focusedRegularResult = focusedSidebarWidget;
      }

      regularSearchResults[focusedRegularResult].focus({ preventScroll: centerizeSelectedResult });
      if (centerizeSelectedResult)
        regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
    }

    function switchToSideBar() {
      sideBarIsFocused = true;

      if (sidebarContainsWidgets) {
        /// Correct the index to reduce window scroll position jumps
        var indexToFocus = Math.floor(focusedRegularResult / averageRegularResultsPerWidget);
        focusedSidebarWidget =
          indexToFocus > sidebarSearchResults.length - 1 ?
            sidebarSearchResults.length - 1 : indexToFocus;

      } else {
        focusedSidebarWidget = focusedRegularResult > sidebarSearchResults.length - 1 ?
          sidebarSearchResults.length - 1 : focusedRegularResult;
      }

      sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: centerizeSelectedResult });
      if (centerizeSelectedResult)
        sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
    }


    function focusPreviousSearchResult() {
      if (sideBarIsFocused) {
        if (focusedSidebarWidget > 0) {
          focusedSidebarWidget -= 1;
          sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: centerizeSelectedResult });

          if (centerizeSelectedResult)
            sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (keyboardCycle) {
            focusLastSearchResult();
          }
        }
      } else {
        if (focusedRegularResult > 0) {
          focusedRegularResult -= 1;
          regularSearchResults[focusedRegularResult].focus({ preventScroll: centerizeSelectedResult });

          if (centerizeSelectedResult)
            regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (keyboardCycle) {
            focusLastSearchResult();
          }
        }
      }
    }

    function focusNextSearchResult() {
      if (sideBarIsFocused) {
        if (focusedSidebarWidget < sidebarSearchResults.length - 1) {
          focusedSidebarWidget += 1;
          sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: centerizeSelectedResult });

          if (centerizeSelectedResult)
            sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (keyboardCycle) {
            focusedSidebarWidget = 0;
            sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: centerizeSelectedResult });
          }
        }
      } else {
        if (focusedRegularResult < regularSearchResults.length - 1) {
          focusedRegularResult += 1;
          regularSearchResults[focusedRegularResult].focus({ preventScroll: centerizeSelectedResult });

          if (centerizeSelectedResult)
            regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (keyboardCycle) {
            focusFirstSearchResult();
          }
        }
      }
    }

    function focusFirstSearchResult() {
      if (sideBarIsFocused) {
        focusedSidebarWidget = 0;
        sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: centerizeSelectedResult });
        if (centerizeSelectedResult)
          sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      } else {
        focusedRegularResult = 0;
        regularSearchResults[focusedRegularResult].focus({ preventScroll: centerizeSelectedResult });
        if (centerizeSelectedResult)
          regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      }
    }

    function focusLastSearchResult() {
      if (sideBarIsFocused) {
        focusedSidebarWidget = sidebarSearchResults.length - 1;
        sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: centerizeSelectedResult });

        if (centerizeSelectedResult)
          sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      } else {
        focusedRegularResult = regularSearchResults.length - 1;
        regularSearchResults[focusedRegularResult].focus({ preventScroll: centerizeSelectedResult });

        if (centerizeSelectedResult)
          regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      }
    }
  }


  console.log('Google Tiles finished proccessing page');
}


function configureTile(tile, maxWidth) {
  if (tile.tagName == 'H2') return;

  /// Create 'a' wrapper
  var wrapper = document.createElement('a');
  // wrapper.setAttribute("style", "outline: none !important;text-decoration: none !important;text-decoration-color: transparent !important; border: 0 !important;");
  wrapper.setAttribute("style", "color: black;outline: none !important;text-decoration: none !important;text-decoration-color: transparent !important; border: 0 !important;");

  wrapper.setAttribute("id", "g-tile");

  /// Set url for 'a' wrapper 
  var url;
  if (tile.className == regularResultClassName) {
    /// For regular result use first found link inside element
    url = tile.querySelector('a').href;
  } else {
    /// For search widget, use the first found 'wikipedia' link - otherwise, the last found link
    try {
      var links = tile.querySelectorAll('a');
      for (i in links) {
        var linkItem = links[i];

        if (linkItem.href !== undefined) {
          if (linkItem.href.includes('wikipedia.org')) {
            url = linkItem.href;
            break;
          } else if (i == links.length - 1) {
            url = linkItem.href;
          }
        }
      }

      /// If failed, use the first found link
      if (url == null || url == undefined || url == '') {
        var firstLink = tile.querySelector('a');
        if (firstLink !== null)
          url = tile.querySelector('a').href;
        else url = '';
      }
    } catch (error) { console.log('Google Tiles error: ' + error); }
  }

  /// Don't wrap if calculated link is the same as url + '#'
  var linkIsValid = url !== null && url !== undefined && url !== window.location.href + '#';

  if (linkIsValid) {
    wrapper.href = url;

    /// Disable link underline for H3 headers
    if (disableTitleUnderlineOnHover) {
      var titles = tile.querySelectorAll('h3');
      titles.forEach(function (title) {
        title.style.textDecoration = 'none';
      })
    }
  }


  /// Add default style for tile
  tile.setAttribute("style", `position:relative;${addTileBackground ? `background-color: ${tileBackgroundColor}` : ''};border:solid ${focusedBorderWidth}px ${addTileBorder ? borderColor : 'transparent'};border-radius: ${borderRadius}px;transition:all ${hoverTransitionDuration}ms ease-out;padding: ${innerPadding}px;margin: 0px 0px ${externalPadding}px;box-shadow: ${shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})` : 'unset'};`);

  if (widerTiles) {
    tile.style.width = '100%';
  }


  var originalTitleColor;

  /// Set 'on hover' styling for each tile
  tile.onmouseover = function () {

    // if (addBackground)
    this.style.backgroundColor = hoverBackground;
    if (highlightTitleOnHover && titles[0] !== undefined && linkIsValid) {
      originalTitleColor = titles[0].style.color;
      titles[0].style.color = titleHoverColor;
    }
  }

  tile.onmouseout = function () {
    this.style.backgroundColor = addTileBackground ? tileBackgroundColor : 'transparent';

    // regular link color: #1A0DAB;
    if (highlightTitleOnHover && titles[0] !== undefined && linkIsValid)
      titles[0].style.color = originalTitleColor ?? 'unset';
  }

  /// Append onClick listeners to visually emulate button press on card by changing shadow 
  if (shadowEnabled && wholeTileIsClickable) {
    tile.onmousedown = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity / 2})`;

      if (scaleUpFocusedResult)
        wrapper.firstChild.style.webkitTransform = `scale(1.0)`;
    }

    tile.onmouseup = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${shadowOpacity})`;
    }
  }

  /// Interactive widget handling 
  /// Without these lines interactive widgets (like weather forecast) horizontally overflow the tile
  var interactiveWidget = tile.querySelector(interactiveWidgetSelector);
  if (interactiveWidget !== null && maxWidth !== null) {
    interactiveWidget.setAttribute("style", `max-width: ${maxWidth}px !important;background-color: transparent;margin: 0px; padding: 0px;border: none !important; outline: none !important`);
  }


  /// Wrap element with 'a' created element
  if (wholeTileIsClickable && linkIsValid)
    tile.wrap(wrapper);


  /// Add keyboard focus listeners
  if (navigateWithKeyboard || numericNavigation) {
    /// Highlight item focused with keyboard
    // wrapper.addEventListener('focus', (event) => {
    wrapper.onfocus = function (event) {
      if (focusedTileDifferentBorder)
        wrapper.firstChild.style.border = `solid ${focusedBorderWidth}px ${keyboardFocusBorderColor}`;

      if (scaleUpFocusedResult) {
        wrapper.firstChild.style.webkitTransform = `scale(${scaleUpFocusedResultAmount})`;
        wrapper.firstChild.style.zIndex = '2';
      }


    }

    /// Remove the highlight from item on focus loss
    wrapper.onblur = function () {
      if (focusedTileDifferentBorder)
        wrapper.firstChild.style.border = `solid ${focusedBorderWidth}px ${addTileBorder ? borderColor : 'transparent'}`;

      if (scaleUpFocusedResult) {
        wrapper.firstChild.style.webkitTransform = `scale(1.0)`;
        wrapper.firstChild.style.zIndex = '1';

      }
    }
  }

  var faviconColor;

  /// Add favicons to website titles
  if (addFavicons || simplifyDomain) {
    var domain = tile.querySelector(domainNameSelector);

    if (domain != null && domain !== undefined) {

      /// Replace domain with simplier version
      if (simplifyDomain) {
        try {
          var titleText;
          var domainContent = domain.textContent.split('.');

          if (domainContent.length == 2) {
            titleText = domainContent[0];
          } else if (domainContent.length == 3) {
            titleText = domainContent[1];

          } else {
            titleText = domain.textContent.replace(/.+\/\/|www.|\..+/g, '');
          }
          titleText = titleText.replaceAll('https://', '');

          /// Add tooltip with full domain on hover
          if (showFullDomainOnHover)
            domain.setAttribute('title', domain.textContent);
          var domainPathSpan = domain.querySelector('span');
          domain.textContent = titleText + (domainPathSpan == null ? '' : domainPathSpan.textContent);
        } catch (error) { console.log(error); }
      }

      /// Create favicon
      // if (addFavicons && url !== null && url !== undefined && url !== '') {
      if (addFavicons && url !== null && url !== undefined && url !== '' && tile.className == regularResultClassName) {
        var favicon = document.createElement('img');

        // favicon.setAttribute("src", 'https://www.google.com/s2/favicons?domain=' + url);

        var domainForFavicon = url.split('/')[2];
        if (domainForFavicon == null || domainForFavicon == undefined)
          domainForFavicon = url;
        console.log(domainForFavicon);
        favicon.setAttribute("src", 'https://www.google.com/s2/favicons?domain=' + domainForFavicon);

        favicon.style.cssText = `height:${faviconRadius}px; width:${faviconRadius}px;  padding-right: 5px;`;
        domain.parentNode.prepend(favicon);

        /// Fix dropdown button position
        var dropdownMenu = tile.querySelector(dropdownMenuSelector);
        if (dropdownMenu != null) {
          domain.appendChild(dropdownMenu);
        }

        /// Fix 'translate page' button position
        var translatePageButton = tile.querySelector(translatePageButtonSelector);
        if (translatePageButton != null && translatePageButton !== undefined) {
          translatePageButton.style.cssText = `margin-left: 6px;`;
          if (dropdownMenu != null) {
            dropdownMenu.appendChild(translatePageButton);
          }
          else {
            domain.appendChild(translatePageButton);
          }
        }

        if (colorizeBorderAfterFavicon)
          favicon.addEventListener("load", function () {
            faviconColor = getFaviconColor(favicon);
            if (faviconColor !== null && faviconColor !== undefined) {
              if (faviconColor !== '#ffffff')
                tile.style.borderColor = faviconColor;
            }
          });
      }
    }
  }

  /// Remove some default tile stylings for children, such as borders and background colors
  var firstTileChild = tile.firstChild;
  if (firstTileChild !== undefined && firstTileChild.style !== undefined) {
    firstTileChild.style.borderColor = 'transparent';
    firstTileChild.style.backgroundColor = 'transparent';
    firstTileChild.style.overflowX = 'hidden';
    firstTileChild.style.overflowY = 'hidden';

    if (firstTileChild.firstChild.style !== undefined)
      firstTileChild.firstChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;

    if (firstTileChild.firstChild.tagName !== undefined) {
      firstTileChild.firstChild.style.borderColor = 'transparent';
      firstTileChild.firstChild.style.backgroundColor = 'transparent';
      /// Special fix for 'news' tab (and maybe for some widgets in main query results)
      firstTileChild.firstChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;
    }
  }


  /// Appending page snapshot
  if (loadPreviews) {
    console.log(`fetching ${url} preview...`);
    var parentId = tile.parentNode.parentNode.id;
    if (url !== undefined && parentId !== 'rhs' && parentId !== 'g-tiles-sidebar' && !url.includes('https://www.google.com/'))
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${url}&key=AIzaSyDlDx1tt0dXdgEUrmKh_qlMjZIOHjcoIFk`)
        .then(response => response.json())
        .then(function (json) {
          var val = json['lighthouseResult'];
          if (val == undefined) return;
          var snapshot = json['lighthouseResult']['audits']['final-screenshot']['details']['data'];
          if (snapshot !== null)
            console.log(snapshot);

          var webpagePreview = document.createElement('img');
          webpagePreview.setAttribute('src', snapshot);
          webpagePreview.setAttribute('height', '80px');
          webpagePreview.setAttribute('width', '125px');
          webpagePreview.setAttribute('style', 'position: absolute;left: -140px');
          tile.prepend(webpagePreview);
        })
        .catch(err => console.log(err));
  }
}


HTMLElement.prototype.wrap = function (wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  wrapper.appendChild(this);
}


function getFaviconColor(img) {
  var colorList = {};

  var imageWidth = img.width;
  var imageHeight = img.height;
  var canvas = document.createElement('canvas');
  canvas.height = imageHeight;
  canvas.width = imageWidth;
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, imageWidth, imageHeight);
  var imageData = context.getImageData(0, 0, imageWidth, imageHeight);
  var data = imageData.data;
  // quickly iterate over all pixels
  // for (i = 0, n = data.length; i < n; i += 4) {
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];


    if (r > 200 && g > 200 && b > 200) continue;
    if (r == 0 && g == 0 && b == 0) continue;

    var hex = rgb2hex("rgb(" + r + "," + g + "," + b + ")");

    if (colorList[hex] == null || colorList[hex] == undefined) {
      colorList[hex] = 1;
    } else {
      colorList[hex] += 1;
    }
  }
  // console.log(colorList);

  var sorted_keys = Object.keys(colorList).sort(function (a, b) { return colorList[a] - (colorList[b]); }).reverse();

  if (sorted_keys.length == 0) return '#000000';
  colorToReturn = colorList[sorted_keys[0]] - colorList[sorted_keys[1]] > 2 ? sorted_keys[0] : sorted_keys[1];
  /// Color returned for results with no favicon. Return white, which will be ignored
  if (colorToReturn == '#4040bf') return '#ffffff';

  // console.log(img.src);
  // console.log(colorToReturn);


  return colorToReturn;
}

//rgb to hex function
function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


init();