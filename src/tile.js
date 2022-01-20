const linkWrapperPrototype = document.createElement('a');
linkWrapperPrototype.id = 'g-tile';

const websiteFaviconPrototype = new Image();
websiteFaviconPrototype.className = 'favicon favicon-loading-spinner';
websiteFaviconPrototype.aspectRadio = 'unset';
// websiteFaviconPrototype.crossOrigin = 'anonymous';

function configureTile(tile) {
    if (tile.tagName == 'H2') return;
    if (tile.parentNode && tile.parentNode.tagName == 'A') return; /// Don't style the same tile twice

    /// Create 'a' wrapper
    if (linkWrapperPrototype.style.cursor == '')
        linkWrapperPrototype.style.cursor = configs.changeCursorOverTile ? 'pointer' : 'unset';
    const wrapper = linkWrapperPrototype.cloneNode(true);

    /// Set url for 'a' wrapper 
    var url;
    if (tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName || tile.className.toLowerCase()[0] == 'g') {
        /// For regular result use first found link inside element
        url = tile.querySelector('a').href;
    }

    var title;

    /// Don't wrap if calculated link is the same as url + '#'
    const linkIsValid = url !== null && url !== undefined && url !== window.location.href + '#';

    if (linkIsValid && tile.className.toLowerCase()[0] == 'g'
        || (tile.firstChild && tile.firstChild.tagName.toLowerCase() == newsPageCardSelector)
        || tile.className == shopPageCardClass) {
        wrapper.href = url;

        title = tile.querySelector('h3');
        if (title !== null)
            title.style.textDecoration = 'none'

        /// Disable link underline for H3 headers
        if (configs.disableTitleUnderlineOnHover) wrapper.classList.add('remove-text-decoration');
    }

    /// Set 'on hover' styling for each tile
    var originalTitleColor;
    if (tile.className[0] == 'g' || tile.className.includes(' g')
        || (tile.firstChild && tile.firstChild.tagName.toLowerCase() == newsPageCardSelector)) {

        tile.addEventListener('mouseover', function () {
            // if (addBackground)
            this.style.backgroundColor = hoverBackgroundColor;
            if (configs.highlightTitleOnHover && title !== undefined && linkIsValid) {
                originalTitleColor = title.style.color;
                title.style.color = configs.titleHoverColor;
            }
        })


        tile.addEventListener('mouseout', function () {
            this.style.backgroundColor = configs.addTileBackground ? tileBackgroundColor : 'transparent';

            // regular link color: #1A0DAB;
            if (configs.highlightTitleOnHover && title !== undefined && linkIsValid)
                title.style.color = originalTitleColor ?? 'unset';
        })

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
            let dot;
            /// Highlight item focused with keyboard
            wrapper.addEventListener('focus', function (event) {
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
                    dot.className = 'g-tile-focused-tile-dot';
                    dot.style.background = configs.keyboardFocusBorderColor;
                    dot.style.opacity = configs.focusedTileDotOpacity;
                    // dot.style.top = `${(tile.clientHeight / 2) - 5}px`;
                    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
                    dot.style.top = `${(tile.clientHeight / 2) + (isFirefox ? configs.externalPadding / 2 : 0) - 5}px`;
                    wrapper.prepend(dot);
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

                if (configs.addFocusedTileDot) {
                    if (dot !== null && dot !== undefined)
                        // wrapper.removeChild(dot);
                        dot.remove();
                }
            });
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

function configureTileHeader(tile, url) {
    const domains = tile.querySelectorAll(domainNameSelector);

    if (domains != null && domains !== undefined)
        domains.forEach(domain => {
            if (domain != null && domain !== undefined) {

                /// Vertically align domain
                domain.style.verticalAlign = 'baseline';

                /// Replace domain with simplier version
                if (configs.simplifyDomain) {
                    try {
                        let titleText = domain.textContent.split('/')[2].split('›')[0];
                        const domainContent = titleText.split('.');

                        if (domainContent.length == 2) {
                            titleText = domainContent[0];
                        } else if (domainContent.length == 3) {
                            titleText = domainContent[1].length > domainContent[0].length ?
                                domainContent[1] == 'google' && domainContent[0] != 'www' ? domainContent[0] : domainContent[1]
                                :
                                domainContent[0] == 'www' || domainContent[0] == 'news' ? domainContent[1] : domainContent[0];

                        } else {
                            titleText = domain.textContent.replace(/.+\/\/|www.|\..+/g, '');
                        }

                        /// Add tooltip with full domain on hover
                        if (configs.showFullDomainOnHover)
                            domain.title = domain.textContent;
                        const domainPathSpan = domain.querySelector('span');
                        domain.textContent = titleText + (domainPathSpan == null ? '' : domainPathSpan.textContent);
                    } catch (error) { console.log(error); }
                }


                if (configs.addFavicons && url !== null && url !== undefined && url !== '' && (
                    tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName ||
                    tile.className.substring(0, 2) == 'g ' || tile.firstChild.className.substring(0, 2) == 'g '
                )) {
                    const favicon = websiteFaviconPrototype.cloneNode(true);

                    let domainForFavicon = url.split('/')[2];
                    if (domainForFavicon == null || domainForFavicon == undefined)
                        domainForFavicon = url;

                    /// Special fix for missing github.com icon
                    if (domainForFavicon == 'github.com') domainForFavicon = 'github.community';

                    /// Trying to load favicon from website
                    const googleFaviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain=` + domainForFavicon + '&sz=24';

                    /// Alternatives
                    // const faviconKitFaviconUrl = `https://api.faviconkit.com/${domainForFavicon}/24`;
                    // const keewebFaciconUrl = `https://services.keeweb.info/favicon/${domainForFavicon}`;
                    // const ddGoFaviconUrl = 'https://icons.duckduckgo.com/ip2/' + domainForFavicon + '.ico';
                    // const websiteFaviconUrl = 'https://' + domainForFavicon + '/' + 'favicon.ico';
                    // const oldGoogleFaviconUrl = `https://www.google.com/s2/favicons?sz=24&domain=` + domainForFavicon;
                    // const anotherGoogleFaviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=` + domainForFavicon;

                    favicon.addEventListener('error', function () {
                        favicon.classList.remove('favicon-loading-spinner');
                    });

                    favicon.addEventListener('load', function (ev) {
                        if (favicon.naturalHeight == 16) {
                            /// If Google is returning default 'globe' icon, remove the favicon
                            favicon.remove();
                            return;
                        }

                        /// Remove the loading spinner
                        favicon.classList.remove('favicon-loading-spinner');

                        /// Get tile border color from favicon's dominant color
                        if (configs.addTileBorder && configs.colorizeBorderAfterFavicon) {
                            const faviconColor = getFaviconColor(favicon);
                            if (faviconColor !== null && faviconColor !== undefined) {

                                if (faviconColor !== '#ffffff')
                                    tile.style.borderColor = faviconColor;
                            }
                        }
                    });

                    favicon.src = googleFaviconUrl;
                    domain.parentNode.prepend(favicon);

                    /// Detect tile with bottom line of links
                    // if (tile.className !== 'g') {
                    //     domain.parentNode.style.position = 'absolute';
                    //     domain.parentNode.style.top = `${configs.innerPadding}px`;
                    //     domain.parentNode.style.left = `${configs.innerPadding}px`;

                    // domain.style.whiteSpace = 'nowrap';
                    // domain.parentNode.parentNode.style.position = 'relative';
                    // }

                    /// Fix dropdown button position
                    const dropdownMenu = tile.querySelector(dropdownMenuSelector);
                    if (dropdownMenu != null) {
                        domain.appendChild(dropdownMenu);
                    }

                    /// Fix 'translate page' button position
                    const translatePageButton = tile.querySelector(translatePageButtonSelector);
                    if (translatePageButton != null && translatePageButton !== undefined) {
                        if (dropdownMenu != null) {
                            dropdownMenu.appendChild(translatePageButton);
                        }
                        else {
                            domain.appendChild(translatePageButton);
                        }
                    }
                }

            }
        });
}