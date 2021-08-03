const linkWrapperPrototype = document.createElement('a');
linkWrapperPrototype.id = 'g-tile';

// let websiteFaviconPrototype;
const websiteFaviconPrototype = new Image();
websiteFaviconPrototype.style.paddingRight = '5px';
websiteFaviconPrototype.aspectRadio = 'unset';
websiteFaviconPrototype.setAttribute('crossorigin', 'anonymous');

websiteFaviconPrototype.style.height = `${configs.faviconRadius}px`;
websiteFaviconPrototype.style.width = `${configs.faviconRadius}px`;
websiteFaviconPrototype.height = `${configs.faviconRadius}px`;
websiteFaviconPrototype.width = `${configs.faviconRadius}px`;


function configureTile(tile, maxWidth) {
    if (tile.tagName == 'H2') return;

    if (tile.parentNode && tile.parentNode.tagName == 'A') return; /// Don't style the same tile twice

    /// Create 'a' wrapper
    if (linkWrapperPrototype.style.cursor == null || linkWrapperPrototype.style.cursor == undefined) linkWrapperPrototype.style.cursor = configs.changeCursorOverTile ? 'pointer' : 'unset';
    const wrapper = linkWrapperPrototype.cloneNode(true);

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

                if (linkItem.href !== undefined && !linkItem.href.includes('webcache.googleusercontent') && !linkItem.className.includes('fl ')) {
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
    const linkIsValid = url !== null && url !== undefined && url !== window.location.href + '#';

    if (linkIsValid && tile.className.toLowerCase()[0] == 'g'
        || (tile.firstChild && tile.firstChild.tagName.toLowerCase() == newsPageCardSelector)
        || tile.className == shopPageCardClass) {
        wrapper.href = url;

        /// Disable link underline for H3 headers
        if (configs.disableTitleUnderlineOnHover) {
            var titles = tile.querySelectorAll('h3');

            titles.forEach(function (title) {
                title.style.textDecoration = 'none';
            })
        }
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
    // if (tile.className.toLowerCase()[0] == 'g') {
    if (tile.className[0] == 'g' || tile.className.includes(' g')
        // || tile.className.substring(0, 2) == 'g ' || tile.firstChild.className.substring(0, 2) == 'g '
        || (tile.firstChild && tile.firstChild.tagName.toLowerCase() == newsPageCardSelector)) {

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
    }









    /// Remove some default tile stylings for children, such as borders and background colors
    // const firstTileChild = tile.firstChild;
    // if (firstTileChild !== undefined && firstTileChild.style !== undefined) {
    //     firstTileChild.style.borderColor = 'transparent';
    //     firstTileChild.style.backgroundColor = 'transparent';
    //     firstTileChild.style.overflowX = 'hidden';
    //     firstTileChild.style.overflowY = 'hidden';

    //     if (firstTileChild.firstChild !== null) {
    //         if (firstTileChild.firstChild.style !== undefined)
    //             firstTileChild.firstChild.style.maxWidth = `${maxWidth == null ? '100%' : maxWidth + 'px'}`;

    //         if (firstTileChild.firstChild.tagName !== undefined) {
    //             firstTileChild.firstChild.style.borderColor = 'transparent';
    //             firstTileChild.firstChild.style.backgroundColor = 'transparent';

    //             // firstTileChild.firstChild.setAttribute('style', 'transition: none !important');
    //         }
    //     }
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

function configureTileHeader(tile, url) {
    const domain = tile.querySelector(domainNameSelector);

    if (domain != null && domain !== undefined) {

        /// Replace domain with simplier version
        if (configs.simplifyDomain) {
            try {
                var titleText = domain.textContent.split('/')[2].split('›')[0];

                // titleText = titleText.replaceAll('https://', '');
                // titleText = titleText.replaceAll('http://', '');

                const domainContent = titleText.split('.');

                console.log(domain.textContent);
                console.log(domainContent);
                console.log(domainContent[0].length);
                console.log(domainContent[1].length);
                console.log('```');

                if (domainContent.length == 2) {
                    titleText = domainContent[0];
                } else if (domainContent.length == 3) {
                    // titleText = domainContent[1] == 'com' || domainContent[1] == 'net' || domainContent[0].length > domainContent[1].length ? domainContent[0] : domainContent[1];
                    titleText = domainContent[1].length > domainContent[0].length ?
                        domainContent[1] == 'google' ? domainContent[0] : domainContent[1]
                        :
                        domainContent[0] == 'www' || domainContent[0] == 'news' ? domainContent[1] : domainContent[0];

                } else {
                    titleText = domain.textContent.replace(/.+\/\/|www.|\..+/g, '');
                }


                /// Add tooltip with full domain on hover
                if (configs.showFullDomainOnHover)
                    domain.title = domain.textContent;
                const domainPathSpan = domain.querySelector('span');
                domain.innerText = titleText + (domainPathSpan == null ? '' : domainPathSpan.textContent);
            } catch (error) { console.log(error); }
        }


        if (configs.addFavicons && url !== null && url !== undefined && url !== '' && (
            tile.className == regularResultClassName || tile.firstChild.className == regularResultClassName ||
            tile.className.substring(0, 2) == 'g ' || tile.firstChild.className.substring(0, 2) == 'g '
        )) {
            if (websiteFaviconPrototype.height !== `${configs.faviconRadius}px`) {
                websiteFaviconPrototype.style.height = `${configs.faviconRadius}px`;
                websiteFaviconPrototype.style.width = `${configs.faviconRadius}px`;
                websiteFaviconPrototype.height = `${configs.faviconRadius}px`;
                websiteFaviconPrototype.width = `${configs.faviconRadius}px`;
            }

            const favicon = websiteFaviconPrototype.cloneNode(true);




            let domainForFavicon = url.split('/')[2];
            if (domainForFavicon == null || domainForFavicon == undefined)
                domainForFavicon = url;

            /// Trying to load favicon from website
            // const websiteFaviconUrl = 'https://' + domainForFavicon + '/' + 'favicon.ico'; 
            const googleFaviconUrl = 'https://www.google.com/s2/favicons?domain=' + domainForFavicon;
            const ddGoFaviconUrl = 'https://icons.duckduckgo.com/ip2/' + domainForFavicon + '.ico';

            // let faviconKitFaviconUrl = `https://api.faviconkit.com/${domainForFavicon}/16`;

            favicon.addEventListener('error', function () {
                // console.log('error loading favicon for ' + domainForFavicon);

                /// Loading favicon from Google service instead
                favicon.src = googleFaviconUrl;
            });

            favicon.src = ddGoFaviconUrl;
            domain.parentNode.prepend(favicon);

            /// Fix positioning
            /// HiHjCd
            /// Detect tile with bottom line of links
            if (tile.className !== 'g') {
                domain.parentNode.style.position = 'absolute';
                domain.parentNode.style.top = `${configs.innerPadding}px`;
                domain.parentNode.style.left = `${configs.innerPadding}px`;
            }

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

            if (configs.colorizeBorderAfterFavicon)
                favicon.addEventListener("load", function () {
                    const faviconColor = getFaviconColor(favicon);
                    if (faviconColor !== null && faviconColor !== undefined) {

                        if (faviconColor !== '#ffffff')
                            tile.style.borderColor = faviconColor;
                    }
                });
        }

    }
}