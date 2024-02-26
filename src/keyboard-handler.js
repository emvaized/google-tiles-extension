
function setKeyboardHandlers(regularResultsColumn, sidebarContainer, counterHintsList) {

    document.addEventListener('keydown', (e) => checkKey(e))

    const searchField = document.querySelector(searchFieldSelector);

    let sideBarIsFocused = false;
    let focusedRegularResult = 0;
    let focusedSidebarWidget = 0;
    let currentTabIndex;

    // if (regularResultsColumn !== null)
        // var regularSearchResults = regularResultsColumn.querySelectorAll('.g-tile');
    if (sidebarContainer !== null)
        var sidebarSearchResults = sidebarContainer.querySelectorAll('.g-tile');

    if (configs.navigateWithKeyboard && regularSearchResults !== undefined && regularSearchResults[0] !== undefined)
        setTimeout(function () {
            regularSearchResults[0].focus();
        }, 0);

    /// If sidebar's fist item is bigger then 2 regular search results, then sidebar contains widgets 
    if (sidebarSearchResults !== null && sidebarSearchResults !== undefined) {
        var firstItem = sidebarSearchResults.item(0);
        if (firstItem !== null)
            var c = firstItem.firstChild;
        if (c !== null && c !== undefined) {
            var height = c.clientHeight;
            // if (regularSearchResults.item(0) !== null && height > regularSearchResults.item(0).firstChild.clientHeight * 2)
            //     sidebarContainsWidgets = true;
        }
    }

    let numericNavigationIndex = 0;

    // if (configs.addTileCounter && configs.numericNavigation && configs.numbersNavigateTabs == false) {
    if (configs.addTileCounter && configs.numericNavigation) {
        regularSearchResults.forEach(function (suggestionTile) {
            let counter = document.createElement('p');
            counter.className = 'g-tile-counter-hint';

            // if (counterHintsOnBottom) {
            //     counter.style.bottom = '0px';
            // } else {
            //     counter.style.top = '0px';
            // }
            counter.style.top = ((configs.innerPadding * 1.0)) + 'px';

            // counter.style.right = `${configs.innerPadding}px`;
            numericNavigationIndex += 1;
            counter.innerText = numericNavigationIndex;
            if (numericNavigationIndex < 10) {
                counterHintsList.push(counter);
                // suggestionTile.firstChild.appendChild(counter);
                let divChild = suggestionTile.querySelector('.g');
                if (divChild) divChild.appendChild(counter);
            }
        })
    }


    function checkKey(e) {
        /// Dont listen for number or arrow keys when searchfield is focused
        if (document.activeElement === searchField || document.activeElement.tagName === 'INPUT') return;

        e = e || window.event;

        /// Spacebar to focus next result
        if (e.keyCode == 32) {
            e.preventDefault();

            if (e.shiftKey)
                focusPreviousSearchResult();
            else
                focusNextSearchResult();

            return;
        }

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

            } else if (e.keyCode == '39') {
                /// right arrow
                e.preventDefault();
            }
        }

        /// Numeric keyboard focus
        if (configs.numericNavigation) {
            const parsed = parseInt(e.key, 10);
            if (isNaN(parsed)) { return; }

            // e.preventDefault();

            if (parsed == 0) {
                /// Focus the search field
                e.preventDefault();

                searchField.focus();

                /// select all text in text field
                searchField.setSelectionRange(0, searchField.value.length);

                /// Animate color of hint
                animateCounterFocus(0);
            } else {
                e.preventDefault();

                /// Focus search category
                // if (configs.numbersNavigateTabs) {
                //     /// Don't handle buttons beyond the 'more' - they are too tricky
                //     if (parsed - 1 > 5) return;
                //     var button = tabButtons[parsed - 1];
                //     var isVisible;

                //     if (configs.firstNumberPressScrollsToElement) {
                //         isVisible = isElementPartiallyInViewport(button);
                //     }

                //     if (isVisible || configs.firstNumberPressScrollsToElement == false) {
                //         animateCounterFocus(parsed <= currentTabIndex ? parsed - 1 : parsed - 2);
                //         setTimeout(function () {
                //             /// Click through some button elements 
                //             /// On different search pages different button's element respond to click - these set covers almost all of them
                //             button.click();
                //             button.firstChild.click();
                //             button.querySelector('span').click();
                //         }, 100);
                //     } else {
                //         button.scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
                //     }


                // } else {
                    /// Focus search result at number
                    focusedRegularResult = parsed - 1;
                    var resultToFocus = regularSearchResults[parsed - 1];
                    if (configs.firstNumberPressScrollsToElement == false || document.activeElement === resultToFocus) {
                        animateCounterFocus(parsed - 1);
                        resultToFocus.focus();
                        resultToFocus.click();
                    } else {
                        animateCounterFocus(parsed - 1);

                        resultToFocus.focus();
                        resultToFocus.scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
                    }

                // }
            }
        }
    }

    function isElementPartiallyInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return (vertInView && horInView);
    }

    function animateCounterFocus(index) {
        let focusedCounterHint = counterHintsList[index];
        focusedCounterHint.style.color = counterHintFocusColor;
        focusedCounterHint.style.opacity = 1.0;
        setTimeout(function () {
            focusedCounterHint.style.color = countedHintColor;
            focusedCounterHint.style.opacity = configs.indexHintOpacity;
        }, 300);
    }

    function focusPreviousSearchResult() {
        if (focusedRegularResult > 0) {
            focusedRegularResult -= 1;
            regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });

            if (configs.centerizeSelectedResult)
                regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
            // if (configs.keyboardCycle) {
            //     focusLastSearchResult();
            // }
        }
        console.log(focusedRegularResult)
        console.log(regularSearchResults[focusedSidebarWidget])
    }

    function focusNextSearchResult() {
        if (focusedRegularResult < regularSearchResults.length) {
            focusedRegularResult += 1;
            regularSearchResults[focusedRegularResult].focus({ preventScroll: configs.centerizeSelectedResult });

            if (configs.centerizeSelectedResult)
                regularSearchResults[focusedRegularResult].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });

        } else {
            // if (configs.keyboardCycle) {
            //     focusFirstSearchResult();
            // }
        }
        console.log(focusedRegularResult)
        console.log(regularSearchResults[focusedSidebarWidget])
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

