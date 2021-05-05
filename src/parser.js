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

/// Currently non-configurable variables
var sidebarPadding = 25;
var imageScaleUpOnHoverAmount = 1.5;
var loadPreviews = false;
var counterHintsOnBottom = true;
var countedHintColor = 'grey';
var counterHintFocusColor = '#EA4335';

function init() {
  let configKeys = Object.keys(configs);

  chrome.storage.local.get(
    configKeys, function (value) {
      configs.tilesEnabled = value.tilesEnabled ?? true;

      if (configs.tilesEnabled) {

        for (var i = 0; i < configKeys.length; i++) {
          let key = configKeys[i];

          if (value[key] !== null && value[key] !== undefined)
            configs[key] = value[key];
        }

        // configKeys.forEach(function (key) {
        //   if (value[key])
        //     configs[key] = value[key];
        // });

        var mainResults = document.getElementById(columnWithRegularResultsId);

        try {

          if (mainResults !== null) {

            /// Regular results handling
            if (mainResults.children.length == 1)
              mainResults = Array.prototype.slice.call(mainResults.firstChild.children);
            else
              mainResults = Array.prototype.slice.call(mainResults.children);

            // console.log(mainResults.length);

            /// Handling when cards are wrapped in div (for example, in Edge)
            if (mainResults.length <= 8)
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

        } catch (error) {
          console.log('Google Tiles error:');
          console.log(error);
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

    // try {
    var regularResultsColumnWidth = regularResultsColumn.clientWidth;

  if (sidebarContainer == null) {
    /// Setting up the sidebar
    sidebarContainer = document.createElement('div');
    sidebarContainer.setAttribute('id', 'g-tiles-sidebar');
    sidebarContainer.setAttribute("style", `position: absolute; top: 0; left:${regularResultsColumnWidth * 1.07 + sidebarPadding}px;width: ${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px !important;padding-left:${sidebarPadding}px;padding-top:0px;`);
    if (regularResultsColumn !== null)
      regularResultsColumn.parentNode.appendChild(sidebarContainer);

    /// Table approach
    // sidebarContainer.setAttribute("style", `width: ${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px !important;margin-left:${sidebarPadding * 5}px;`);
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
    sidebarContainer.setAttribute("style", `width: ${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px !important;padding-top:6px;`);

  /// Adding some padding for 'results count' text on and navbar for better visual symmetry
  var resultStats = document.querySelector(resultStatsSelector);
  if (resultStats !== null)
    resultStats.setAttribute("style", `padding: 0px ${configs.innerPadding}px;`);
  var navBar = document.querySelector(navBarSelector);
  if (navBar !== null)
    navBar.setAttribute("style", `padding: 0px ${configs.innerPadding}px;`);

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
  if (botstuff !== null && botstuff !== undefined) {
    tiles.push(botstuff);
  }

  /// Add adverts to proccessed elements
  var addsBlock = document.getElementById('tads');
  if (addsBlock !== null && addsBlock !== undefined) {
    tiles.unshift(addsBlock);
  }

  var numericNavigationIndex = 0;

  /// Apply styles for all the other elements
  if (regularResultsColumn !== null)
    tiles.forEach(function (suggestionTile) {
      if (suggestionTile.clientHeight !== 0.0 && suggestionTile.clientWidth !== 0.0 && suggestionTile.firstChild !== undefined) {

        // if (suggestionTile.className !== regularResultClassName) {
        if (suggestionTile.className !== regularResultClassName && suggestionTile.firstChild.className !== regularResultClassName) {

          /// If sidebar height won't exceed regular results height, move tile there
          if (sidebarContainer !== null && sidebarContainer.clientHeight + suggestionTile.clientHeight <= regularResultsColumn.clientHeight && suggestionTile.className !== shopPageCardClass && suggestionTile.tagName !== newsPageCardSelector.toUpperCase()) {

            /// Attach widget to sidebar
            if (configs.tryToPlaceWidgetsOnTheSide)
              sidebarContainer.appendChild(suggestionTile);
            else if (configs.moveSuggestionsToBottom)
              regularResultsColumn.append(suggestionTile);
            if (configs.applyStyleToWidgets) {
              configureTile(suggestionTile, regularResultsColumnWidth * configs.sidebarWidthMultiplier);
            }
          } else {
            /// Otherwise, attach it on bottom of regular results scrollbar
            if (configs.moveSuggestionsToBottom)
              regularResultsColumn.append(suggestionTile);

            if (configs.applyStyleToWidgets) {
              configureTile(suggestionTile, regularResultsColumnWidth);
            }
          }
        } else {
          // configureTile(suggestionTile);

          if (suggestionTile.className == regularResultClassName) {
            configureTile(suggestionTile);
          } else {
            /// Special handling when tile is wrapped in div
            suggestionTile.setAttribute('style', 'margin-bottom: 0px !important;');
            configureTile(suggestionTile.firstChild);
          }

          /// Add index hint
          if (configs.addTileCounter && configs.numericNavigation && configs.numbersNavigateTabs == false) {
            var counter = document.createElement('p');
            counter.setAttribute("style", `color: ${countedHintColor};opacity: ${configs.indexHintOpacity};position:absolute; right: ${configs.innerPadding}px;transition: all 300ms ease-out`);

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
        // } catch (error) { console.log('Google Tiles error: ' + error); }


        /// Add scale-up effect for image results
        if (configs.scaleUpImageResultsOnHover) {
          var imageResults = suggestionTile.querySelectorAll(imageResultTileSelector);

          var heightPadding = (imageScaleUpOnHoverAmount - 1.0) / 2;

          if (imageResults !== null && imageResults !== undefined) {
            imageResults.forEach(function (image) {
              try {
                var height = image.clientHeight;

                image.onmouseover = function (event) {
                  this.setAttribute('style', `${image.parentNode.classList.contains(imageCarouselClass) ? `margin: 0px ${height * heightPadding}px;` : ''} -webkit-transform:scale(${imageScaleUpOnHoverAmount}); z-index: 999; transition: all 150ms ease-in-out; box-shadow: 0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity}) `);
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
        if (configs.scrollHorizontalViewOnHover) {

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
                  }, configs.delayToScrollOnHover);
                }
              });
          }

        }
      } else {
        /// Remove the weird bottom margin for empty divs on page
        suggestionTile.style.margin = '0px';
      }
    });
  // } catch (error) {
  //   console.log('Google Tiles error: ' + error)
  // }
  else {
    ///Add scale-up effect for image results page
    if (configs.scaleUpImageResultsOnHover) {
      var imageResults = document.querySelectorAll(imagesPageImageSelector);

      if (imageResults !== null && imageResults !== undefined) {
        imageResults.forEach(function (image) {
          image.onmouseover = function (event) {
            this.parentNode.setAttribute('style', `-webkit-transform:scale(${imageScaleUpOnHoverAmount}); z-index: 999; transition: all 150ms ease-in-out; box-shadow: 0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity}) `);
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
  if (configs.addTileCounter && configs.numericNavigation) {
    try {
      var zeroCounter = document.createElement('span');
      zeroCounter.setAttribute("style", `position: absolute; z-index:0; right: -15px; top: 50%; color: ${countedHintColor};opacity: ${configs.indexHintOpacity}; transition: all 300ms ease-in-out`);
      zeroCounter.innerHTML = '0';
      counterHintsList.push(zeroCounter);

      var searchField = document.querySelector('button').parentNode.parentNode;
      searchField.appendChild(zeroCounter);
    } catch (error) { console.log(error); }
  }


  /// Set keyboard listeners
  if (configs.navigateWithKeyboard || configs.numericNavigation) {
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

    if (configs.navigateWithKeyboard && regularSearchResults !== undefined && regularSearchResults[0] !== undefined) regularSearchResults[0].focus();

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

    /// Attach index hints to tab categories when numeric tab navigation is configs.enabled
    if (configs.numericNavigation && configs.numbersNavigateTabs) {
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
            if (configs.addTileCounter)
              try {
                var counter = document.createElement('p');
                counter.setAttribute("style", `color: ${countedHintColor};opacity: ${configs.indexHintOpacity};position:absolute;top:0px;left: 0px;transition: all 300ms ease-out`);
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
      if (document.activeElement === searchField || document.activeElement.tagName === 'INPUT') return;

      e = e || window.event;

      /// Arrow keys navigation
      if (configs.navigateWithKeyboard && regularResultsColumn !== null) {


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

          if (sidebarSearchResults !== null && sidebarSearchResults.length !== 0 && configs.sideArrowsFocusSidebarFirst) {
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

          if (sidebarSearchResults !== null && sidebarSearchResults.length !== 0 && configs.sideArrowsFocusSidebarFirst) {
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
      if (configs.numericNavigation) {

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

          if (configs.numbersNavigateTabs) {
            /// Don't handle buttons beyond the 'more' - they are too tricky
            if (parsed - 1 > 5) return;

            var button = tabButtons[parsed - 1];

            var isVisible;

            if (configs.firstNumberPressScrollsToElement) {
              isVisible = isElementPartiallyInViewport(button);
            }

            if (isVisible || configs.firstNumberPressScrollsToElement == false) {
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
            if (configs.firstNumberPressScrollsToElement == false || document.activeElement === resultToFocus) {
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
        counterHintsList[index].style.opacity = configs.indexHintOpacity;
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

      regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });
      if (configs.centerizeSelectedResult)
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

      sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: configs.centerizeSelectedResult });
      if (configs.centerizeSelectedResult)
        sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
    }


    function focusPreviousSearchResult() {
      if (sideBarIsFocused) {
        if (focusedSidebarWidget > 0) {
          focusedSidebarWidget -= 1;
          sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: configs.centerizeSelectedResult });

          if (configs.centerizeSelectedResult)
            sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (configs.keyboardCycle) {
            focusLastSearchResult();
          }
        }
      } else {
        if (focusedRegularResult > 0) {
          focusedRegularResult -= 1;
          regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });

          if (configs.centerizeSelectedResult)
            regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (configs.keyboardCycle) {
            focusLastSearchResult();
          }
        }
      }
    }

    function focusNextSearchResult() {
      if (sideBarIsFocused) {
        if (focusedSidebarWidget < sidebarSearchResults.length - 1) {
          focusedSidebarWidget += 1;
          sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: configs.centerizeSelectedResult });

          if (configs.centerizeSelectedResult)
            sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (configs.keyboardCycle) {
            focusedSidebarWidget = 0;
            sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: configs.centerizeSelectedResult });
          }
        }
      } else {
        if (focusedRegularResult < regularSearchResults.length - 1) {
          focusedRegularResult += 1;
          regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });

          if (configs.centerizeSelectedResult)
            regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
          if (configs.keyboardCycle) {
            focusFirstSearchResult();
          }
        }
      }
    }

    function focusFirstSearchResult() {
      if (sideBarIsFocused) {
        focusedSidebarWidget = 0;
        sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: configs.centerizeSelectedResult });
        if (configs.centerizeSelectedResult)
          sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      } else {
        focusedRegularResult = 0;
        regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });
        if (configs.centerizeSelectedResult)
          regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      }
    }

    function focusLastSearchResult() {
      if (sideBarIsFocused) {
        focusedSidebarWidget = sidebarSearchResults.length - 1;
        sidebarSearchResults[focusedSidebarWidget].focus({ preventScroll: configs.centerizeSelectedResult });

        if (configs.centerizeSelectedResult)
          sidebarSearchResults[focusedSidebarWidget].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
      } else {
        focusedRegularResult = regularSearchResults.length - 1;
        regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });

        if (configs.centerizeSelectedResult)
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
  if (tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName) {
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
  let linkIsValid = url !== null && url !== undefined && url !== window.location.href + '#';

  if (linkIsValid && tile.className.toLowerCase()[0] == 'g') {
    wrapper.href = url;

    /// Disable link underline for H3 headers
    if (configs.disableTitleUnderlineOnHover) {
      var titles = tile.querySelectorAll('h3');
      titles.forEach(function (title) {
        title.style.textDecoration = 'none';
      })
    }
  }

  /// Add default style for tile
  tile.setAttribute("style", `position:relative;${configs.addTileBackground ? `background-color: ${configs.tileBackgroundColor}` : ''};border:solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'};border-radius: ${configs.borderRadius}px;transition:all ${configs.hoverTransitionDuration}ms ease-out;padding: ${configs.innerPadding}px;margin: 0px 0px ${configs.externalPadding}px;box-shadow: ${configs.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})` : 'unset'};`);

  if (configs.widerTiles) {
    tile.style.width = '100%';
  }


  /// Get result's full title
  // try {
  //   if (titles !== undefined && titles[0] !== undefined && titles[0].textContent.endsWith('...') && url !== null && url !== undefined && url !== '')
  //     getResultFullTilte(url, titles[0]);
  // } catch (e) {
  //   console.log('Error during adding on-hover full title:');
  //   console.log(e);
  // }


  /// Set 'on hover' styling for each tile
  var originalTitleColor;
  if (tile.className.toLowerCase()[0] == 'g') {
    tile.onmouseover = function () {

      // if (addBackground)
      this.style.backgroundColor = configs.hoverBackground;
      if (configs.highlightTitleOnHover && titles[0] !== undefined && linkIsValid) {
        originalTitleColor = titles[0].style.color;
        titles[0].style.color = configs.titleHoverColor;
      }
    }

    tile.onmouseout = function () {
      this.style.backgroundColor = configs.addTileBackground ? configs.tileBackgroundColor : 'transparent';

      // regular link color: #1A0DAB;
      if (configs.highlightTitleOnHover && titles[0] !== undefined && linkIsValid)
        titles[0].style.color = originalTitleColor ?? 'unset';
    }
  }


  /// Append onClick listeners to visually emulate button press on card by changing shadow 
  if (configs.shadowEnabled && configs.wholeTileIsClickable) {
    tile.onmousedown = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity / 2})`;

      if (configs.scaleUpFocusedResult)
        wrapper.firstChild.style.webkitTransform = `scale(1.0)`;
    }

    tile.onmouseup = function () {
      this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})`;
    }
  }

  /// Interactive widget handling 
  /// Without these lines interactive widgets (like weather forecast) horizontally overflow the tile
  var interactiveWidget = tile.querySelector(interactiveWidgetSelector);
  if (interactiveWidget !== null && maxWidth !== null) {
    interactiveWidget.setAttribute("style", `max-width: ${maxWidth}px !important;background-color: transparent;margin: 0px; padding: 0px;border: none !important; outline: none !important`);
  }

  /// Ignore clicks on dropdown buttons
  var accordion = tile.querySelector('g-accordion-expander');
  if (accordion !== null && accordion !== undefined) {
    // var tileDescriptions = tile.querySelectorAll('span');
    // if (tileDescriptions !== null && tileDescriptions !== undefined) {
    //   for (i in tileDescriptions) {
    //     var elem = tileDescriptions[i];
    //     if (elem.clientHeight !== 0.0 && elem.clientWidth !== 0.0) {
    //       elem.wrap(wrapper);
    //       break;
    //     }
    //   }
    // }
  } else {
    /// Wrap tile with 'a' created element
    if (configs.wholeTileIsClickable && linkIsValid)
      tile.wrap(wrapper);
  }


  /// Add keyboard focus listeners
  if (configs.navigateWithKeyboard || configs.numericNavigation) {
    let dot;
    /// Highlight item focused with keyboard
    // wrapper.addEventListener('focus', (event) => {
    wrapper.onfocus = function (event) {
      /// Change border
      if (configs.focusedTileDifferentBorder)
        wrapper.firstChild.style.border = `solid ${configs.focusedBorderWidth}px ${configs.keyboardFocusBorderColor}`;

      /// Scale up
      if (configs.scaleUpFocusedResult) {
        wrapper.firstChild.style.webkitTransform = `scale(${configs.scaleUpFocusedResultAmount})`;
        wrapper.firstChild.style.zIndex = '2';
      }

      /// Add dot on the left
      if (configs.addFocusedTileDot) {
        dot = document.createElement('div');
        dot.setAttribute('class', 'g-tile-focused-tile-dot');
        dot.setAttribute('style', `background: ${configs.keyboardFocusBorderColor}; opacity: ${configs.focusedTileDotOpacity}; height: 10px; width: 10px; border-radius: 50%; float: left; position: relative; top: -${tile.clientHeight / 2 + configs.externalPadding}px; left: -40px;`);
        wrapper.appendChild(dot);
      }
    }

    /// Remove the highlight from item on focus loss
    wrapper.onblur = function () {
      if (configs.focusedTileDifferentBorder)
        wrapper.firstChild.style.border = `solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'}`;

      if (configs.scaleUpFocusedResult) {
        wrapper.firstChild.style.webkitTransform = `scale(1.0)`;
        wrapper.firstChild.style.zIndex = '1';
      }

      if (configs.addFocusedTileDot) {
        if (dot !== null && dot !== undefined)
          wrapper.removeChild(dot);
      }
    }
  }

  var faviconColor;

  /// Add favicons to website titles
  if (configs.addFavicons || configs.simplifyDomain) {
    var domain = tile.querySelector(domainNameSelector);

    if (domain != null && domain !== undefined) {

      /// Replace domain with simplier version
      if (configs.simplifyDomain) {
        try {
          var titleText;
          var domainContent = domain.textContent.split('.');

          if (domainContent.length == 2) {
            titleText = domainContent[0];
          } else if (domainContent.length == 3) {
            titleText = domainContent[1] == 'com' || domainContent[1] == 'net' ? domainContent[0] : domainContent[1];

          } else {
            titleText = domain.textContent.replace(/.+\/\/|www.|\..+/g, '');
          }
          titleText = titleText.replaceAll('https://', '');
          titleText = titleText.replaceAll('http://', '');

          /// Add tooltip with full domain on hover
          if (configs.showFullDomainOnHover)
            domain.setAttribute('title', domain.textContent);
          var domainPathSpan = domain.querySelector('span');
          domain.textContent = titleText + (domainPathSpan == null ? '' : domainPathSpan.textContent);
        } catch (error) { console.log(error); }
      }

      /// Create favicon
      if (configs.addFavicons && url !== null && url !== undefined && url !== '' && (tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName)) {
        // var favicon = document.createElement('img');
        var favicon = new Image();
        var domainForFavicon = url.split('/')[2];
        if (domainForFavicon == null || domainForFavicon == undefined)
          domainForFavicon = url;

        // if (domainForFavicon.includes('github.com'))
        //   favicon.setAttribute("src", 'https://image.flaticon.com/icons/png/512/25/25231.png');
        // else  
        // favicon.setAttribute("src", 'https://www.google.com/s2/favicons?domain=' + domainForFavicon);

        let websiteFaviconUrl = 'https://' + domainForFavicon + '/' + 'favicon.ico';
        let googleFaviconUrl = 'https://www.google.com/s2/favicons?domain=' + domainForFavicon;
        let faviconKitFaviconUrl = `https://api.faviconkit.com/${domainForFavicon}/16`;

        favicon.addEventListener('error', function () {
          // console.log('error loading favicon for ' + domainForFavicon);

          /// Loading favicon from Google service instead
          favicon.setAttribute("src", googleFaviconUrl);
          // favicon.setAttribute("src", faviconKitFaviconUrl);
        });

        /// Trying to load favicon from website
        favicon.setAttribute("src", domainForFavicon == 'medium.com' ? 'https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Medium-512.png' : websiteFaviconUrl);

        /// Set size and style
        favicon.setAttribute('height', `${configs.faviconRadius}px`);
        favicon.setAttribute('width', `${configs.faviconRadius}px`);
        favicon.style.cssText = `height:${configs.faviconRadius}px; width:${configs.faviconRadius}px;  padding-right: 5px;`;
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

        if (configs.colorizeBorderAfterFavicon)
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
    // firstTileChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;

    if (firstTileChild.firstChild.style !== undefined)
      firstTileChild.firstChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;

    if (firstTileChild.firstChild.tagName !== undefined) {
      firstTileChild.firstChild.style.borderColor = 'transparent';
      firstTileChild.firstChild.style.backgroundColor = 'transparent';
      /// Special fix for 'news' tab (and maybe for some widgets in main query results)
      // firstTileChild.firstChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;
    }
  }

  // console.log('tile ' + tile);
  tile.querySelectorAll('div').forEach(function (child) {
    try {
      child.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;

      // console.log(child.style);
      console.log(child.getAttribute('style').toString());
    } catch (e) { console.log(e); }
  });


  // if (configs.disableExpandAnimations) {

  //   let itemsWithExpandingSections = tile.querySelectorAll(`div[style*="transition"]`);
  //   if (itemsWithExpandingSections !== null && itemsWithExpandingSections !== undefined) {
  //     console.log('found items with expanding secitons!');
  //     itemsWithExpandingSections.forEach(function (item) {
  //       item.setAttribute('style', 'transition: none !important');
  //     })
  //   }

  //   console.log("found expanding item!");
  //   child.style.transition = 'none';
  // }


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


init();