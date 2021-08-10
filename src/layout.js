function setLayout() {

    var regularResultsColumn = document.getElementById(columnWithRegularResultsId);
    var regularResultsColumnWidth = regularResultsColumn.clientWidth;

    var mainResults;
    var counterHintsList = [];

    if (regularResultsColumn !== null) {
        // let regularResultsChildren = regularResultsColumn.children;
        let regularResultsChildren = regularResultsColumn.querySelectorAll(`#${columnWithRegularResultsId} > div`);

        /// Regular results handling
        if (regularResultsChildren.length == 1)
            // mainResults = Array.prototype.slice.call(regularResultsColumn.firstChild.children);
            mainResults = Array.prototype.slice.call(regularResultsColumn.firstChild.querySelectorAll(`#${columnWithRegularResultsId} > div`));
        else
            mainResults = Array.prototype.slice.call(regularResultsChildren);

        /// Special handling for news results page
        // if (mainResults.length == 2) {
        //     let newsMainResults = mainResults[0].querySelectorAll(newsPageCardSelector);
        //     newsMainResults = Array.prototype.slice.call(newsMainResults);

        //     mainResults[1].firstChild.style.cssText = 'overflow-x: auto !important';
        //     newsMainResults.push(mainResults[1]);
        //     mainResults = newsMainResults;
        // }
        // else

        /// Special handling for shop page (quite a shaky way to determine - desirably to rewrite)
        if (mainResults.length <= 5) {
            let shopPageResults = regularResultsColumn.querySelectorAll(`.${shopPageCardClass}`);
            shopPageResults = Array.prototype.slice.call(shopPageResults);
            mainResults = shopPageResults;
        }

        /// Add search suggestions div to proccessed elements
        const botstuff = document.getElementById(peopleAlsoSearchForId);
        if (botstuff !== null && botstuff !== undefined) {
            mainResults.push(botstuff);
        }

        /// Add adverts to proccessed elements
        const addsBlock = document.getElementById('tads');
        if (addsBlock !== null && addsBlock !== undefined) {
            mainResults.unshift(addsBlock);
        }

        /// Detect or create sidebar container
        var sidebarContainer = document.getElementById('rhs');

        if (sidebarContainer == null) {
            /// Setting up new sidebar
            sidebarContainer = document.createElement('div');
            sidebarContainer.id = 'g-tiles-sidebar';
            sidebarContainer.style.left = `${regularResultsColumnWidth * 1.12 + sidebarPadding}px`;
            sidebarContainer.style.paddingLeft = `${sidebarPadding}px;`;

            if (regularResultsColumn !== null)
                regularResultsColumn.parentNode.appendChild(sidebarContainer);
        }

        if (configs.applyStyleToWidgets) sidebarContainer.classList.add('stylized-sidebar');

        let sidebarHeight = sidebarContainer.scrollHeight;
        const sidebarNewChildrenContainer = document.createElement('span');
        const regularResultsNewChildrenContainer = document.createElement('span');

        mainResults.forEach(function (result) {
            if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
                /// Don't proccess
            } else if (result.tagName == 'HR') {
                result.parentNode.removeChild(result);
            } else if (result.className == regularResultClassName || result.className.substring(0, 2) == 'g ') {
                /// Regular result
                if (configs.addFavicons || configs.simplifyDomain)
                    configureTileHeader(result, result.querySelector('a').href)

                configureTile(result);

            } else {
                const wrappedCard = result.querySelector(`[class='g'], [class^='g ']`);

                if (wrappedCard !== null) {
                    /// Regular result wrapped in div

                    // const ch = result.firstChild;
                    if (wrappedCard !== null && wrappedCard !== undefined) {
                        result.style.margin = '0px';

                        // if (ch.className == 'g' || result.className.substring(0, 2) == 'g ') {
                        const className = wrappedCard.className;
                        if (className[0] == 'g' && (className[1] == undefined || className[1] == '')) {
                            regularResultsColumn.insertBefore(wrappedCard, result);

                            if (configs.addFavicons || configs.simplifyDomain)
                                configureTileHeader(wrappedCard, wrappedCard.querySelector('a').href)

                            configureTile(wrappedCard);
                        }
                    }

                    // let ch = result.children;
                    // ch = Array.prototype.slice.call(ch);
                    // console.log(ch.length);
                    // if (ch !== null && ch !== undefined && ch.length > 0) {
                    //     result.style.margin = '0px';

                    //     ch.forEach(function (c) {
                    //         if (c.className == 'g' || result.className.substring(0, 2) == 'g ') {
                    //             regularResultsColumn.insertBefore(c, result);

                    //             if (configs.addFavicons || configs.simplifyDomain) {
                    //                 configureTileHeader(c, c.querySelector('a').href)
                    //             }
                    //             configureTile(c);
                    //         }
                    //     })
                    // }
                } else if (result.clientHeight !== 0.0 && result.clientWidth !== 0.0 && result.firstChild !== undefined) {
                    /// Search widget

                    if (sidebarContainer !== null && sidebarHeight + result.clientHeight <= regularResultsColumn.scrollHeight
                        && result.className !== shopPageCardClass
                        && result.tagName !== newsPageCardSelector.toUpperCase() && result.firstChild.tagName !== newsPageCardSelector.toUpperCase()) {
                        /// Move widget to sidebar
                        /// If sidebar height won't exceed regular results height, move tile there

                        if (configs.tryToPlaceWidgetsOnTheSide) {
                            sidebarHeight += result.clientHeight;
                            sidebarNewChildrenContainer.appendChild(result);
                        } else if (configs.moveSuggestionsToBottom) {
                            regularResultsNewChildrenContainer.appendChild(result);
                            if (configs.applyStyleToWidgets)
                                result.classList.add('g');
                        }
                    } else {
                        /// Otherwise, attach it on bottom of regular results scrollbar
                        if (configs.moveSuggestionsToBottom) {
                            regularResultsNewChildrenContainer.appendChild(result);
                            if (configs.applyStyleToWidgets)
                                result.classList.add('g');

                            configureTile(result)
                        }
                    }

                    /// Add scale-up effect for image results
                    if (configs.scaleUpImageResultsOnHover) {
                        var imageResults = result.querySelectorAll(imageResultTileSelector);
                        const heightPadding = (imageScaleUpOnHoverAmount - 1.0) / 2;

                        if (imageResults !== null && imageResults !== undefined) {
                            imageResults.forEach(function (image) {
                                try {
                                    const height = image.clientHeight;

                                    image.addEventListener('mouseover', function (event) {
                                        this.setAttribute('style', `${image.parentNode.classList.contains(imageCarouselClass) ? `margin: 0px ${height * heightPadding}px;` : ''} -webkit-transform:scale(${imageScaleUpOnHoverAmount}); transform:scale(${imageScaleUpOnHoverAmount}); z-index: 1; transition: all 150ms ease-in-out; box-shadow: 0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity}) `);
                                    })

                                    image.addEventListener('mouseout', function (event) {
                                        this.setAttribute('style', `-webkit-transform:scale(1.0); transform: scale(1.0); z-index: 0; transition: all 150ms ease-in-out;`);
                                    })

                                    /// If image is inside horizontal carouosel, add margins
                                    /// TODO: Needs a better implementation, doesn't work in current state
                                    if (image.parentNode.classList.contains(imageCarouselClass)) {
                                        var imageCarouselContainer = image.parentNode;

                                        imageCarouselContainer.onmouseover = function (event) {
                                            imageCarouselContainer.setAttribute('style', `margin-bottom: ${height * heightPadding}px;margin-top: ${height * heightPadding}px;transition: all 150ms ease-in-out;`);
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

                        var scrollableCards = result.querySelectorAll(scrollableCardSelector);

                        if (scrollableCards !== null && scrollableCards !== undefined) {
                            /// Try to proccess 'More news' cards on news page
                            if (scrollableCards.length == 0)
                                scrollableCards = result.querySelectorAll(newsPageCardSelector);

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
                    /// Remove bottom margin for empty divs on page
                    result.style.margin = '0px';
                    result.style.marginBottom = '0px';
                }

            }
        })

        if (configs.applyStyleToWidgets == false)
            sidebarNewChildrenContainer.style.paddingLeft = '12px';
        sidebarContainer.appendChild(sidebarNewChildrenContainer);
        regularResultsColumn.appendChild(regularResultsNewChildrenContainer);

        /// Populate sidebar with regular results
        if (configs.populateSidebarWithRegularResults)
            setTimeout(function () {
                sidebarHeight = sidebarContainer.clientHeight;

                const regularResultsChildrenArray = regularResultsColumn.children;
                const l = regularResultsChildrenArray.length;
                const sidebarMovedRegularResultsContainer = document.createElement('span');

                for (let i = l; i > -1; i--) {
                    const child = regularResultsChildrenArray[i];
                    if (child == undefined) continue;

                    const childHeight = child.getBoundingClientRect().height;
                    if (childHeight == 0.0) continue;

                    // if (sidebarHeight + childHeight <= regularResultsColumn.scrollHeight - document.getElementById('footcnt').clientHeight) {
                    if (sidebarHeight + childHeight <= regularResultsColumn.scrollHeight - 200) {
                        try {
                            sidebarHeight = sidebarHeight + childHeight;
                            sidebarMovedRegularResultsContainer.prepend(child);

                            if (child.firstChild != null)
                                child.firstChild.classList.add('nofullwidth'); /// override 'width: 100%'
                        } catch (e) { console.log(e); }
                    } else { break; }
                }
                if (configs.populatedSidebarResultsOnTop) {
                    sidebarContainer.prepend(sidebarMovedRegularResultsContainer);
                }
                else {
                    /// Add spacing on top
                    // const spacing = document.createElement('div');
                    // spacing.style.height = `${configs.externalPadding}px`;
                    // sidebarMovedRegularResultsContainer.prepend(spacing);

                    sidebarContainer.appendChild(sidebarMovedRegularResultsContainer);
                }
            }, 1);


        /// Set keyboard listeners
        if (configs.navigateWithKeyboard || configs.numericNavigation) {
            setKeyboardHandlers(regularResultsColumn, sidebarContainer, counterHintsList);
        }

        console.timeEnd('Google Tiles finished proccessing page in');

    }
}


function setSidebarWidgets(sidebarContainer) {
    let sidebarWidgets;

    sidebarWidgets = sidebarContainer.children;
    sidebarWidgets = Array.prototype.slice.call(sidebarWidgets);

    sidebarWidgets.reverse().forEach(function (item) {
        if (item.clientHeight !== 0.0 && item.clientWidth !== 0.0 && (item.tagName == 'DIV' || item.tagName == 'G-SECTION-WITH-HEADER')) {
            configureTile(item);
            item.style.boxSizing = 'unset';
        }
    });
}

function hideNumberResultsRow() {
    /// Hides the 'number results found' line
    const appbar = document.getElementById('appbar');
    appbar.style.visibility = 'hidden';
    appbar.style.height = '0px';
    appbar.style.paddingTop = '42px';

}

function setTopBar() {
    /// Some experiments to place category buttons to the right of searchbox
    if (topBar == null)
        topBar = document.getElementById(regularCategoryButtonsParentId);
    const topBarParent = topBar.parentNode;

    topBarParent.removeChild(topBar);
    topBarParent.style.display = 'none';

    topBar.classList.add('moved-top-bar');
    document.querySelector('.sfbg').appendChild(topBar);

    /// Fix padding for 'results found' bar
    document.querySelector('.appbar').style.paddingTop = `${paddingWhenNavbarMoved}px`;

    /// Fix the position for search settings bar
    document.querySelector('#hdtbMenus').style.top = '30px';

    // window.addEventListener('resize', function (e) {
    //     console.log(e);
    //     // topBar.setAttribute('style', '')
    //     topBar.style.maxWidth = `${window.innerWidth * 0.35}px`;
    //     topBar.style.minWidth = `${window.innerWidth * 0.35}px`;
    //     topBar.style.overflow = 'hidden';
    //     topBar.style.right = '12.5%';

    //     // topBar.style.right = '10%';
    //     // topBar.style.right = '200px';
    // })
}


// function removeSearchbarShadow() {
//     let searchbar = document.querySelector('button').parentNode;
//     searchbar.style.boxShadow = 'none';
//     searchbar.style.border = '1px solid lightgray';
// }