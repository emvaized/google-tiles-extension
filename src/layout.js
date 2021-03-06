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
            // sidebarContainer.style.position = 'absolute';
            // sidebarContainer.style.top = '0';
            sidebarContainer.style.left = `${regularResultsColumnWidth * 1.12 + sidebarPadding}px`;
            // sidebarContainer.style.width = `${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px`;
            // sidebarContainer.style.paddingTop = '0px';
            sidebarContainer.style.paddingLeft = `${sidebarPadding}px;`;

            if (regularResultsColumn !== null)
                regularResultsColumn.parentNode.appendChild(sidebarContainer);

        }


        let sidebarNewChildrenContainer = document.createElement('span');
        let sidebarHeight = sidebarContainer.scrollHeight;
        let regularResultsNewChildrenContainer = document.createElement('span');

        mainResults.forEach(function (result) {
            try {

                if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
                } else if (result.tagName == 'HR') {
                    result.parentNode.removeChild(result);
                    // } else if (result.className == regularResultClassName) {
                } else if (result.className == regularResultClassName || result.className.substring(0, 2) == 'g ') {
                    /// Regular result

                    if (configs.addFavicons || configs.simplifyDomain) {
                        configureTileHeader(result, result.querySelector('a').href)
                    }

                    configureTile(result);
                }

                else if (result.querySelector(`[class='g']`) !== null || result.querySelector(`[class^='g ']`) !== null) {
                    /// Regular result wrapped in div

                    let ch = result.children;
                    ch = Array.prototype.slice.call(ch);
                    if (ch !== null && ch !== undefined && ch.length > 0) {
                        result.style.margin = '0px';

                        ch.forEach(function (c) {
                            if (c.className == 'g' || result.className.substring(0, 2) == 'g ') {
                                regularResultsColumn.insertBefore(c, result);

                                if (configs.addFavicons || configs.simplifyDomain) {
                                    configureTileHeader(c, c.querySelector('a').href)
                                }
                                configureTile(c);
                            }
                        })
                    }
                } else if (result.clientHeight !== 0.0 && result.clientWidth !== 0.0 && result.firstChild !== undefined) {

                    /// Search widget
                    if (sidebarContainer !== null && sidebarHeight + result.clientHeight <= regularResultsColumn.clientHeight
                        && result.className !== shopPageCardClass
                        && result.tagName !== newsPageCardSelector.toUpperCase() && result.firstChild.tagName !== newsPageCardSelector.toUpperCase()) {
                        /// Move widget to sidebar
                        /// If sidebar height won't exceed regular results height, move tile there

                        if (configs.tryToPlaceWidgetsOnTheSide) {
                            sidebarHeight += result.clientHeight;
                            sidebarNewChildrenContainer.appendChild(result);
                        }
                        else if (configs.moveSuggestionsToBottom) {
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

                        var heightPadding = (imageScaleUpOnHoverAmount - 1.0) / 2;

                        if (imageResults !== null && imageResults !== undefined) {
                            imageResults.forEach(function (image) {
                                try {
                                    var height = image.clientHeight;

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

            } catch (e) {
                console.log(e);
            }
        })

        sidebarContainer.appendChild(sidebarNewChildrenContainer);
        regularResultsColumn.appendChild(regularResultsNewChildrenContainer);

        /// Set keyboard listeners
        if (configs.navigateWithKeyboard || configs.numericNavigation) {
            setKeyboardHandlers(regularResultsColumn, sidebarContainer, counterHintsList);
        }

        // console.log('Google Tiles finished proccessing page');
        console.timeEnd('G-Tiles finished proccessing page in');

    } else {
        /// Image page results handling

        // var container = document.getElementById('islrg');
        // var images = container.firstChild.children;

        // setLayout();
    }


}


function setSidebarWidgets(sidebarContainer) {
    let sidebarWidgets;

    sidebarWidgets = sidebarContainer.children;
    sidebarWidgets = Array.prototype.slice.call(sidebarWidgets);

    sidebarWidgets.reverse().forEach(function (item) {
        if (item.clientHeight !== 0.0 && item.clientWidth !== 0.0 && (item.tagName == 'DIV' || item.tagName == 'G-SECTION-WITH-HEADER')) {
            configureTile(item);

            // item.style.width = '105%';
            item.style.boxSizing = 'unset';
        }
    });
}


function setTopBar() {
    /// Some experiments to place category buttons near to searchbox
    if (topBar == null)
        topBar = document.getElementById(regularCategoryButtonsParentId);
    const topBarParent = topBar.parentNode;

    topBarParent.removeChild(topBar);
    document.querySelector('.sfbg').appendChild(topBar);

    topBar.style.position = 'absolute';
    topBar.style.top = '10px';
    topBar.style.right = '12%';
    topBar.style.marginLeft = '0';

    // topBar.style.maxWidth = '40%';
    // topBar.style.minWidth = '40%';

    topBarParent.parentNode.removeChild(topBarParent);
    document.querySelector('.appbar').style.paddingTop = `${paddingWhenNavbarMoved}px`;

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