
function setKeyboardHandlers(regularResultsColumn, sidebarContainer, counterHintsList) {

    // document.onkeydown = checkKey;
    document.addEventListener('keydown', (e) => checkKey(e))

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

    let tabButtons;
    let topBar;

    /// Attach index hints to tab categories when numeric tab navigation is configs.enabled
    if (configs.numericNavigation && configs.numbersNavigateTabs) {

        // var topBar = document.querySelector(regularCategoryButtonsParentSelector);
        topBar = document.getElementById(regularCategoryButtonsParentId);

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
                let item = tabButtons[i];
                if (item.tagName == undefined) continue;
                if (item.classList.length > 1 && currentTabIndex == null) {
                    currentTabIndex = i;
                } else {
                    if (configs.addTileCounter)
                        try {
                            let counter = document.createElement('p');
                            counter.setAttribute("style", `color: ${countedHintColor};opacity: ${configs.indexHintOpacity};position:absolute;top:0px;left: 0px;transition: all 300ms ease-out`);
                            counter.id = 'g-tile-counter-hint';
                            counter.textContent = parseInt(i) + 1;
                            counterHintsList.push(counter);

                            item.style.position = 'relative';
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

        console.log(e);

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

            // console.log(parsed);

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

