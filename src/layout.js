var regularResultsColumn;
var regularResultsColumnWidth;
var initialResultsColumn;
var sidebarContainer;

function setRegularResults() {
    if (!initialResultsColumn) initialResultsColumn = document.getElementById('center_col');

    /// Iterate regular results
    const allTiles = initialResultsColumn.querySelectorAll(`div > .g:not(.g-tiles-proccessed):not(:has(.g)):not(:has(g-section-with-header))`);
    const mainResults = Array.prototype.slice.call(allTiles);

    for (let i = 0, n = mainResults.length, result; i < n; i++) {
        result = mainResults[i];

        if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
            /// Don't proccess
        } else if (result.tagName == 'HR') {
            result.remove();
        } else {
            if (!result.hasChildNodes()) {
                result.remove();
                continue;
            }

            /// Regular result
            Promise.all([configureTile(result), configureTileHeader(result)])
            result.classList.add('g-tiles-proccessed')
        }
    }
}

function setSidebar(lazyLoaded = false) {
    if (!configs.tryToPlaceWidgetsOnTheSide) return
    if (ignoreClientHeightChanges) return;
    if (configs.dontProccessWidgetsIfWindowNarrow && window.innerWidth < configs.sidebarWidth * 3) return;
    ignoreClientHeightChanges = true;

    /// Detect or create sidebar container
    if (!regularResultsColumn) regularResultsColumn = document.getElementById(columnWithRegularResultsId);
    if (!regularResultsColumnWidth) regularResultsColumnWidth = regularResultsColumn.clientWidth;

     if (!sidebarContainer) {
        sidebarContainer = document.getElementById('rhs');

        if (!sidebarContainer)
            sidebarContainer = document.querySelector('.g-tiles-sidebar');

        if (!sidebarContainer) {
            /// Setting up new sidebar
            sidebarContainer = document.createElement('div');
            sidebarContainer.className = 'g-tiles-sidebar';

            if (regularResultsColumn) regularResultsColumn.parentNode.appendChild(sidebarContainer);
        }
    }
    
    // Move images on top of page to sidebar
    if (!lazyLoaded && configs.moveTopPhotosToSidebar) {
        try {
            /// consider apply to #kp-wp-tab-overview div:has(block-component) as well
            const headerImagesContainer = regularResultsColumn.querySelector('#kp-wp-tab-overview div:has(#media_result_group):not(.g-tiles-proccessed)');
            if (headerImagesContainer) {
                sidebarContainer.querySelector('div[role="complementary"]').prepend(headerImagesContainer) 
            }
        } catch(e) {}
    }

    /// Iterate widgets
    let sidebarHeight = sidebarContainer.clientHeight;
    const sidebarNewChildrenContainer = document.createElement('span');

    const widgets = document.querySelectorAll(`
        #${columnWithRegularResultsId} > div:not(:has(.g-tiles-proccessed)),
        #tads, #rhsads, #bres, .cUnQKe,
        g-section-with-header:not(.g-tiles-processed):not(:has(.g-tiles-proccessed)),
        .TzHB6b.cLjAic:has(.HnYYW),
        .ULSxyf:not(:has(.g))
    `);

    const widgetsArray = Array.prototype.slice.call(widgets);
    for (let i = 0, n = widgetsArray.length, result; i < n; i++) {
        result = widgetsArray[i];

        if (!result.hasChildNodes() || result.tagName == 'H2' || result.tagName == 'SCRIPT') {
            /// Don't proccess
        } else if (result.tagName == 'HR') {
            result.remove();
        } else if (result.clientHeight && result.clientWidth && result.firstChild) {
            /// Search widget
            if (result.classList.contains('g-tiles-proccessed')) continue;

            /// Move widget to sidebar
            /// If sidebar height won't exceed regular results height, move tile there

            if (lazyLoaded) {
                const topOffset = result.getBoundingClientRect().top;
                if (topOffset >= sidebarHeight) {
                    result.style.position = 'absolute'
                    result.style.top = topOffset + 'px';
                }
            }

            sidebarHeight += result.clientHeight;
            sidebarNewChildrenContainer.appendChild(result);
            result.style.marginTop = `22px`;
            result.classList.add('g-tiles-proccessed')
        } else {
            /// Remove margins for empty divs on page
            result.style.margin = '0px';
        }
    }

    if (sidebarContainer) sidebarContainer.appendChild(sidebarNewChildrenContainer);

    /// If there is photo carousel on page on top, combine it with first tile for better design
    // const photoCarousel = document.querySelector('#kp-wp-tab-overview div:has(#media_result_group):not(.g-tiles-proccessed)')
    // if (photoCarousel) {
    //     photoCarousel.classList.add('g-tiles-proccessed');
    //     photoCarousel.style.marginBottom = configs.innerPadding + 'px';
    //     document.querySelector('.g').prepend(photoCarousel)  
    // }

    console.log('Google Tweaker finished proccessing page');
    setTimeout(function(){
        lastKnownBodyHeight = document.body.clientHeight;
        ignoreClientHeightChanges = false;
    }, 1)
    return;
}