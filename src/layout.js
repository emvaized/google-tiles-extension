function setLayout(elements) {
    var counterHintsList = [];

    var regularResultsColumn = document.getElementById(columnWithRegularResultsId);
    var tiles = elements;

    var sidebarContainer = document.getElementById('rhs');

    regularResultsColumn = document.getElementById(columnWithRegularResultsId);

    var regularResultsColumnWidth = regularResultsColumn.clientWidth;

    if (sidebarContainer == null) {
        /// Setting up the sidebar
        sidebarContainer = document.createElement('div');

        sidebarContainer.id = 'g-tiles-sidebar';
        sidebarContainer.style.position = 'absolute';
        sidebarContainer.style.top = '0';
        // sidebarContainer.style.left = `${regularResultsColumnWidth * 1.07 + sidebarPadding}px`;
        sidebarContainer.style.left = `${regularResultsColumnWidth * 1.12 + sidebarPadding}px`;
        sidebarContainer.style.width = `${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px`;
        sidebarContainer.style.paddingTop = '0px';
        sidebarContainer.style.paddingLeft = `${sidebarPadding}px;`;

        // sidebarContainer.setAttribute('id', 'g-tiles-sidebar');
        // sidebarContainer.setAttribute("style", `position: absolute; top: 0; left:${regularResultsColumnWidth * 1.07 + sidebarPadding}px;width: ${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px !important;padding-left:${sidebarPadding}px;padding-top:0px;`);

        if (regularResultsColumn !== null)
            regularResultsColumn.parentNode.appendChild(sidebarContainer);

    } else {
        // sidebarContainer.setAttribute("style", `width: ${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px !important;padding-top:6px;`);
        sidebarContainer.style.width = `${regularResultsColumnWidth * configs.sidebarWidthMultiplier}px`;
        sidebarContainer.style.paddingTop = `6px`;

        /// Apply styles for elements already in sidebar
        if (sidebarContainer !== null) {
            setSidebarWidgets(sidebarContainer);
        }
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
    // if (regularResultsColumn !== null)
    if (tiles !== null)
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
                        // suggestionTile.setAttribute('style', 'margin-bottom: 0px !important;');
                        suggestionTile.style.marginBottom = '0px';
                        configureTile(suggestionTile.firstChild);
                    }

                    /// Add index hint
                    // if (configs.addTileCounter && configs.numericNavigation && configs.numbersNavigateTabs == false) {
                    //     var counter = document.createElement('p');
                    //     counter.setAttribute("style", `color: ${countedHintColor};opacity: ${configs.indexHintOpacity};position:absolute; right: ${configs.innerPadding}px;transition: all 300ms ease-out`);

                    //     if (counterHintsOnBottom) {
                    //         counter.style.bottom = '0px';
                    //     } else {
                    //         counter.style.top = '0px';
                    //     }
                    //     counter.id = 'g-tile-counter-hint';
                    //     numericNavigationIndex += 1;
                    //     counter.textContent = numericNavigationIndex;
                    //     if (numericNavigationIndex < 10) {
                    //         counterHintsList.push(counter);
                    //         suggestionTile.appendChild(counter);
                    //     }
                    // }
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
            zeroCounter.id = 'g-tile-counter-hint';
            zeroCounter.style.zIndex = '0';
            zeroCounter.style.right = '-15px';
            zeroCounter.style.top = '50%';

            // zeroCounter.setAttribute("style", `position: absolute; z-index:0; right: -15px; top: 50%; color: ${countedHintColor};opacity: ${configs.indexHintOpacity}; transition: all 300ms ease-in-out`);
            zeroCounter.innerHTML = '0';
            counterHintsList.push(zeroCounter);

            var searchField = document.querySelector('button').parentNode.parentNode;
            searchField.appendChild(zeroCounter);
        } catch (error) { console.log(error); }
    }

    // if (configs.addTileCounter && configs.numericNavigation && configs.numbersNavigateTabs == false) {
    //     document.querySelectorAll('.g').forEach(function (suggestionTile) {
    //         // regularSearchResults.forEach(function (suggestionTile) {
    //         let counter = document.createElement('p');
    //         counter.id = 'g-tile-counter-hint';

    //         if (counterHintsOnBottom) {
    //             counter.style.bottom = '0px';
    //         } else {
    //             counter.style.top = '0px';
    //         }
    //         counter.style.right = `${configs.innerPadding}px`;

    //         numericNavigationIndex += 1;
    //         counter.textContent = numericNavigationIndex;
    //         if (numericNavigationIndex < 10) {
    //             suggestionTile.appendChild(counter);
    //             counterHintsList.push(counter);
    //         }
    //     })
    // }

    /// Set keyboard listeners
    if (configs.navigateWithKeyboard || configs.numericNavigation) {
        setKeyboardHandlers(regularResultsColumn, sidebarContainer, counterHintsList);
    }

    console.log('Google Tiles finished proccessing page');
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
    let topBarParent = topBar.parentNode;
    document.querySelector('.sfbg').appendChild(topBar);
    // topBar.setAttribute('style', 'position: absolute; right: 180px; top: 10px; bottom: 0px; ');
    topBar.style.position = 'absolute';
    // topBar.style.right = '180px';
    topBar.style.right = '10%';
    topBar.style.top = '10px';

    // topBarParent.style.maxHeight = '15px';
    topBarParent.parentNode.removeChild(topBarParent);
    document.querySelector('.appbar').style.paddingTop = `${paddingWhenNavbarMoved}px`;

    // window.addEventListener('resize', function () {
    //     topBar.setAttribute('style', '')
    // })
}