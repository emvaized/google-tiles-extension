function configureTile(tile, maxWidth) {
    if (tile.tagName == 'H2') return;

    if (tile.parentNode && tile.parentNode.tagName == 'A') return; /// Don't style the same tile twice

    /// Create 'a' wrapper
    var wrapper = document.createElement('a');
    wrapper.style.cursor = configs.changeCursorOverTile ? 'pointer' : 'unset';

    wrapper.id = 'g-tile';


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
    // tile.setAttribute("style", `position:relative;${configs.addTileBackground ? `background-color: ${configs.tileBackgroundColor}` : ''};border:solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'};border-radius: ${configs.borderRadius}px;transition:all ${configs.hoverTransitionDuration}ms ease-out;padding: ${configs.innerPadding}px;margin: 0px 0px ${configs.externalPadding}px;box-shadow: ${configs.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})` : 'unset'};`);

    if (tile.style.margin !== `margin: 0px 0px ${configs.externalPadding}px`) {
        tile.style.position = 'relative';
        if (configs.addTileBackground)
            tile.style.backgroundColor = configs.tileBackgroundColor;
        tile.style.border = `solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'}`;
        tile.style.borderRadius = `${configs.borderRadius}px`;
        // tile.style.transition = `all ${configs.hoverTransitionDuration}ms ease-out`;
        tile.style.transition = tileTransition;
        tile.style.padding = `${configs.innerPadding}px`;
        tile.style.margin = `0px 0px ${configs.externalPadding}px`;
        tile.style.boxShadow = `${configs.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})` : 'unset'}`;
    }

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

        tile.addEventListener('mouseover', function () {
            // if (addBackground)
            this.style.backgroundColor = configs.hoverBackground;
            if (configs.highlightTitleOnHover && titles[0] !== undefined && linkIsValid) {
                originalTitleColor = titles[0].style.color;
                titles[0].style.color = configs.titleHoverColor;
            }
        })


        tile.addEventListener('mouseout', function () {
            this.style.backgroundColor = configs.addTileBackground ? configs.tileBackgroundColor : 'transparent';

            // regular link color: #1A0DAB;
            if (configs.highlightTitleOnHover && titles[0] !== undefined && linkIsValid)
                titles[0].style.color = originalTitleColor ?? 'unset';
        })

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

    /// Interactive widget handling 
    /// Without these lines interactive widgets (like weather forecast) horizontally overflow the tile
    var interactiveWidget = tile.querySelector(interactiveWidgetSelector);
    if (interactiveWidget !== null && maxWidth !== null) {
        interactiveWidget.style.maxWidth = `${maxWidth}px`;
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
                dot.style.top = `-${tile.clientHeight / 2 + configs.externalPadding}px`;
                // dot.setAttribute('style', `background: ${configs.keyboardFocusBorderColor}; opacity: ${configs.focusedTileDotOpacity}; top: -${tile.clientHeight / 2 + configs.externalPadding}px; `);
                wrapper.appendChild(dot);
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
                    wrapper.removeChild(dot);
            }
        });
    }


    /// Remove some default tile stylings for children, such as borders and background colors
    var firstTileChild = tile.firstChild;
    if (firstTileChild !== undefined && firstTileChild.style !== undefined) {
        firstTileChild.style.borderColor = 'transparent';
        firstTileChild.style.backgroundColor = 'transparent';
        firstTileChild.style.overflowX = 'hidden';
        firstTileChild.style.overflowY = 'hidden';

        if (firstTileChild.firstChild !== null) {
            if (firstTileChild.firstChild.style !== undefined)
                firstTileChild.firstChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;

            if (firstTileChild.firstChild.tagName !== undefined) {
                firstTileChild.firstChild.style.borderColor = 'transparent';
                firstTileChild.firstChild.style.backgroundColor = 'transparent';

                // firstTileChild.firstChild.setAttribute('style', 'transition: none !important');
            }
        }

    }

    /// Set max width to all div children so that they don't exceed tile border
    setSpecificStylesToChildren(tile, maxWidth);

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

function setSpecificStylesToChildren(tile, maxWidth) {

    tile.querySelectorAll('div').forEach(function (child) {
        if (child.parentNode.nextElementSibling && child.parentNode.nextElementSibling.tagName == 'TABLE') {
            /// Special handling for 'g' class elements wrapped inside another (revert styling)
            child.setAttribute('style', 'all: revert; margin: 0px !important;')
        } else
            /// set max width to all children
            try {
                child.style.maxWidth = `${maxWidth == null ? '100%' : (maxWidth - configs.innerPadding) + 'px'}`;
            } catch (e) { console.log(e); }
    });
}


function configureTileHeader(tile, url) {
    var faviconColor;

    let domain = tile.querySelector(domainNameSelector);

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


        if (configs.addFavicons && url !== null && url !== undefined && url !== '' && (tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName)) {
            // var favicon = document.createElement('img');
            let favicon = new Image();
            let domainForFavicon = url.split('/')[2];
            if (domainForFavicon == null || domainForFavicon == undefined)
                domainForFavicon = url;

            const websiteFaviconUrl = 'https://' + domainForFavicon + '/' + 'favicon.ico';
            const faviconKitFaviconUrl = 'https://api.faviconkit.com/' + domainForFavicon + '/' + '16';
            const googleFaviconUrl = 'https://www.google.com/s2/favicons?domain=' + domainForFavicon;
            const ddGoFaviconUrl = 'https://icons.duckduckgo.com/ip2/' + domainForFavicon + '.ico';

            // let faviconKitFaviconUrl = `https://api.faviconkit.com/${domainForFavicon}/16`;

            favicon.addEventListener('error', function () {
                // console.log('error loading favicon for ' + domainForFavicon);

                /// Loading favicon from Google service instead
                favicon.setAttribute("src", googleFaviconUrl);
                // favicon.setAttribute("src", faviconKitFaviconUrl);
            });

            /// Trying to load favicon from website
            // favicon.setAttribute("src", domainForFavicon == 'medium.com' ? 'https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Medium-512.png' : websiteFaviconUrl);


            // favicon.addEventListener('load', function (e) {
            //     // console.log('error loading favicon for ' + domainForFavicon);
            //     console.log(domainForFavicon);
            //     console.log(e);

            // });


            /// Set size and style
            favicon.height = `${configs.faviconRadius}px`;
            favicon.width = `${configs.faviconRadius}px`;
            favicon.setAttribute('crossorigin', 'anonymous');
            favicon.src = ddGoFaviconUrl;
            favicon.style.paddingRight = '5px';
            favicon.style.height = `${configs.faviconRadius}px`;
            favicon.style.width = `${configs.faviconRadius}px`;

            // favicon.style.cssText = `height:${configs.faviconRadius}px; width:${configs.faviconRadius}px; padding-right: 5px;`;
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