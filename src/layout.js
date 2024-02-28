var regularResultsColumn;
var regularResultsColumnWidth;
var initialResultsColumn;
var lazyLoadedResultsColumn;
var sidebarContainer;

function setRegularResults(lazyLoaded = false) {
    if (!initialResultsColumn) initialResultsColumn = document.getElementById('center_col');
    if (lazyLoaded && !lazyLoadedResultsColumn) lazyLoadedResultsColumn = document.getElementById('botstuff');

    /// Iterate regular results
    const allTiles = (lazyLoaded ? lazyLoadedResultsColumn : initialResultsColumn).querySelectorAll(`div > .g:not(.g-tiles-proccessed):not(:has(.g))`);
    const mainResults = Array.prototype.slice.call(allTiles);
    for (let i = 0, n = mainResults.length, result; i < n; i++) {
        result = mainResults[i];

        if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
            /// Don't proccess
        } else if (result.tagName == 'HR') {
            result.remove();
        } else {
            /// Regular result
            configureTileHeader(result)
            configureTile(result);
            result.classList.add('g-tiles-proccessed')
        }
    }
}

function setLayout() {

    /// Detect or create sidebar container
    if (!regularResultsColumn) regularResultsColumn = document.getElementById(columnWithRegularResultsId);
    if (!regularResultsColumnWidth) regularResultsColumnWidth = regularResultsColumn.clientWidth;
    
     if (!sidebarContainer) {
        sidebarContainer = document.getElementById('rhs');

        if (!sidebarContainer)
            sidebarContainer = document.getElementById('g-tiles-sidebar');

        if (!sidebarContainer) {
            /// Setting up new sidebar
            sidebarContainer = document.createElement('div');
            sidebarContainer.id = 'g-tiles-sidebar';
            // sidebarContainer.style.left = `${regularResultsColumnWidth + sidebarPadding + (configs.sidebarPadding * 1.0)}px`;
            // sidebarContainer.style.paddingLeft = `${sidebarPadding}px;`;

            if (regularResultsColumn !== null)
                regularResultsColumn.parentNode.appendChild(sidebarContainer);
        }

        // if (configs.applyStyleToWidgets) sidebarContainer.classList.add('stylized-sidebar');
    }

    /// Iterate widgets
    let sidebarHeight = sidebarContainer.scrollHeight;
    const sidebarNewChildrenContainer = document.createElement('span');
    const regularResultsNewChildrenContainer = document.createElement('span');

    if (configs.tryToPlaceWidgetsOnTheSide) {
        const widgets = document.querySelectorAll(`
            #${columnWithRegularResultsId} > div:not(:has(.g-tiles-proccessed)),
            #tads:not(.g-tiles-proccessed), 
            #rhsads:not(.g-tiles-proccessed), 
            #bres:not(.g-tiles-proccessed), 
            .cUnQKe:not(.g-tiles-proccessed)
        `);
        const widgetsArray = Array.prototype.slice.call(widgets);
        for (let i = 0, n = widgetsArray.length, result; i < n; i++) {
            result = widgetsArray[i];

            if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
                /// Don't proccess
            } else if (result.tagName == 'HR') {
                // result.parentNode.removeChild(result);
                result.remove();
            } else if (result.clientHeight !== 0.0 && result.clientWidth !== 0.0 && result.firstChild !== undefined) {
                /// Search widget
                if (result.classList.contains('g-tiles-proccessed')) return;

                if (sidebarContainer !== null && sidebarHeight + result.clientHeight <= regularResultsColumn.scrollHeight) {
                    /// Move widget to sidebar
                    /// If sidebar height won't exceed regular results height, move tile there

                    sidebarHeight += result.clientHeight;
                    // result.style.marginTop = `${configs.externalPadding}px`;
                    result.style.marginTop = `22px`;
                    sidebarNewChildrenContainer.appendChild(result);
                    result.classList.add('g-tiles-proccessed')
                } 
            } else {
                /// Remove margins for empty divs on page
                result.style.margin = '0px';
            }
        }
    }

    sidebarContainer.appendChild(sidebarNewChildrenContainer);
    regularResultsColumn.appendChild(regularResultsNewChildrenContainer);

    /// Populate sidebar with regular results
    if (configs.populateSidebarWithRegularResults == true)
        setTimeout(function () {
            if (configs.populateSidebarWithRegularResults !== false) {
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
                    sidebarContainer.appendChild(sidebarMovedRegularResultsContainer);
                }
            }
        }, 1);

    /// If there is photo carousel on page on top, combine it with first tile for better design
    // const photoCarousel = document.querySelector('#kp-wp-tab-overview div:has(#media_result_group):not(.g-tiles-proccessed)')
    // if (photoCarousel) {
    //     photoCarousel.classList.add('g-tiles-proccessed');
    //     photoCarousel.style.marginBottom = configs.innerPadding + 'px';
    //     document.querySelector('.g').prepend(photoCarousel)  
    // }

    console.log('Google Tweaks finished proccessing page');
    return;

}

// function setTopBar() {
//     /// Some experiments to place category buttons to the right of searchbox
//     if (topBar == null)
//         topBar = document.getElementById(regularCategoryButtonsParentId);
//     if (topBar == null) return;
//     const topBarParent = topBar.parentNode;

//     topBarParent.removeChild(topBar);
//     topBarParent.style.display = 'none';

//     topBar.classList.add('moved-top-bar');
//     document.querySelector('.sfbg').appendChild(topBar);

//     /// Fix padding for 'results found' bar
//     document.querySelector('.appbar').style.paddingTop = `${paddingWhenNavbarMoved}px`;

//     /// Fix the position for search settings bar
//     document.querySelector('#hdtbMenus').style.top = '30px';
// }