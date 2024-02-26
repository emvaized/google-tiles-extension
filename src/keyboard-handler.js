
function setKeyboardHandlers(regularResultsColumn, sidebarContainer, counterHintsList) {

    document.addEventListener('keydown', (e) => checkKey(e))

    const searchField = document.querySelector(searchFieldSelector);

    let focusedRegularResult = 0;

    if (configs.navigateWithKeyboard && regularSearchResults !== undefined && regularSearchResults[0] !== undefined)
        setTimeout(function () {
            regularSearchResults[0].focus();
        }, 0);

    let numericNavigationIndex = 0;

    // if (configs.addTileCounter && configs.numericNavigation && configs.numbersNavigateTabs == false) {
    if (configs.addTileCounter && configs.numericNavigation) {
        regularSearchResults.forEach(function (suggestionTile) {
            let counter = document.createElement('p');
            counter.className = 'g-tile-counter-hint';
            // counter.style.top = ((configs.innerPadding * 1.0)) + 'px';

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
            }
        }
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
    }
}

