const linkWrapperPrototype = document.createElement('a');
linkWrapperPrototype.className = 'g-tile';

function configureTile(tile, keyboardAccessible = true) {
    if (tile.tagName == 'H2') return;
    if (tile.parentNode && tile.parentNode.tagName == 'A') return; /// Don't style the same tile twice
    if (tile.innerHTML == '') tile.remove();

    try {
        /// Set url for 'a' wrapper 
        var url;
        if (tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName || tile.className.toLowerCase()[0] == 'g') {
            /// For regular result use first found link inside element
            url = tile.querySelector('a').href;
        }

        /// Create 'a' wrapper
        if (linkWrapperPrototype.style.cursor == '')
            linkWrapperPrototype.style.cursor = configs.changeCursorOverTile ? 'pointer' : 'unset';
        const wrapper = linkWrapperPrototype.cloneNode(true);

        /// Don't wrap if calculated link is the same as url + '#'
        const linkIsValid = url !== null && url !== undefined && url !== window.location.href + '#';

        if (linkIsValid && tile.className.toLowerCase()[0] == 'g') {
            wrapper.href = url;

            /// Disable link underline for H3 headers
            if (configs.disableTitleUnderlineOnHover) wrapper.classList.add('remove-text-decoration');
        }


        if (configs.highlightTitleOnHover) {
            tile.classList.add('highlightTitleOnHover')
        }

        /// Append onClick listeners to visually emulate button press on card by changing shadow 
        if (configs.shadowEnabled && configs.wholeTileIsClickable) {
            tile.addEventListener('mousedown', function () {
                this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity / 2})`;

                if (configs.scaleUpFocusedResult)
                    wrapper.firstChild.style.webkitTransform = `scale(1.0)`;
            })

            tile.addEventListener('mouseup', function () {
                this.style.boxShadow = `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})`;
            })
        }

        /// Ignore clicks on dropdown buttons
        const accordion = tile.querySelector('g-accordion-expander');
        if (accordion !== null && accordion !== undefined) {
        } else {
            /// Wrap tile with 'a' created element
            if (configs.wholeTileIsClickable && linkIsValid)
                tile.wrap(wrapper);
        }

        /// Add keyboard focus listeners
        if (configs.navigateWithKeyboard || configs.numericNavigation) {

            if (configs.addFocusedTileDot) { 
                wrapper.classList.add('add-focused-dot');
            }

            /// Highlight item focused with keyboard
            if (configs.focusedTileDifferentBorder || configs.scaleUpFocusedResult) {
                wrapper.addEventListener('focus', function (event) {
                    /// Change border
                    if (configs.focusedTileDifferentBorder)
                        wrapper.firstChild.style.border = `solid ${configs.focusedBorderWidth}px ${configs.keyboardFocusBorderColor}`;

                    /// Scale up
                    if (configs.scaleUpFocusedResult) {
                        wrapper.firstChild.style.webkitTransform = `scale(${configs.scaleUpFocusedResultAmount})`;
                        wrapper.firstChild.style.zIndex = '2';
                    }
                });

                /// Remove the highlight from item on focus loss
                wrapper.addEventListener('blur', function (event) {
                    if (configs.focusedTileDifferentBorder)
                        wrapper.firstChild.style.border = `solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'}`;

                    if (configs.scaleUpFocusedResult) {
                        wrapper.firstChild.style.webkitTransform = `scale(1.0)`;
                        wrapper.firstChild.style.zIndex = '1';
                    }
                });
            }
        }

        /// Get tile border color from favicon's dominant color
        if (configs.addTileBorder && configs.colorizeBorderAfterFavicon) {
            const favicon = tile.querySelector('img.XNo5Ab');
            const faviconColor = getFaviconColor(favicon);
            if (faviconColor !== null && faviconColor !== undefined) {

                if (faviconColor !== '#ffffff')
                    tile.style.borderColor = faviconColor;
            }
        }

        tile.classList.add('g-tiles-proccessed')
        // if (keyboardAccessible && !regularSearchResults.includes(wrapper)) regularSearchResults.push(wrapper)
        if (keyboardAccessible) regularSearchResults.push(wrapper)

    } catch (error) { console.log(error); }
}

function configureTileHeader(tile) {
    if (configs.simplifyDomain) {
        const domains = tile.querySelectorAll('cite');

        if (domains) {
            domains.forEach(domain => {
                if (domain && domain.textContent.includes('/')) {
                    try {
                        /// Replace domain with simplier version
                        try {
                            /// Add tooltip with full domain on hover
                            if (configs.showFullDomainOnHover)
                                domain.title = domain.textContent;

                            domain.textContent = domain.textContent.replace(/(http(s)?:\/\/|www\.)/g, '')
                        } catch (error) { console.log(error); }
                    } catch (e) { console.log(e); }
                }
            });
        }
    }
}
