var regularResultsColumn;
var regularResultsColumnWidth;
var allResultsColumn;
var sidebarContainer;

function setLayout() {

    /// Iterate regular results
    var allTiles = document.querySelectorAll(`div > .g:not(.g-tiles-proccessed):not(:has(.g))`);
    var mainResults = Array.prototype.slice.call(allTiles);
    mainResults.forEach(function (result) {
        if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
            /// Don't proccess
        } else if (result.tagName == 'HR') {
            // result.parentNode.removeChild(result);
            result.remove();
        } else {
            /// Regular result
            configureTileHeader(result)
            configureTile(result);
        }
    })

    /// Iterate widgets
    /// Detect or create sidebar container
    if (!regularResultsColumn) regularResultsColumn = document.getElementById(columnWithRegularResultsId);
    if (!regularResultsColumnWidth) regularResultsColumnWidth = regularResultsColumn.clientWidth;
    if (!allResultsColumn) allResultsColumn = document.getElementById('rcnt');
    
     if (!sidebarContainer) {
        sidebarContainer = document.getElementById('rhs');

        if (!sidebarContainer)
            sidebarContainer = document.getElementById('g-tiles-sidebar');

        if (!sidebarContainer) {
            /// Setting up new sidebar
            sidebarContainer = document.createElement('div');
            sidebarContainer.id = 'g-tiles-sidebar';
            sidebarContainer.style.left = `${regularResultsColumnWidth + sidebarPadding + (configs.sidebarPadding * 1.0)}px`;
            sidebarContainer.style.paddingLeft = `${sidebarPadding}px;`;

            if (regularResultsColumn !== null)
                regularResultsColumn.parentNode.appendChild(sidebarContainer);
        }

        if (configs.applyStyleToWidgets) sidebarContainer.classList.add('stylized-sidebar');
    }

    let sidebarHeight = sidebarContainer.scrollHeight;
    const sidebarNewChildrenContainer = document.createElement('span');
    const regularResultsNewChildrenContainer = document.createElement('span');

    var widgets = document.querySelectorAll(`#${columnWithRegularResultsId} > div:not(:has(.g-tiles-proccessed)):not(:has(#media_result_group)),#tads, #rhsads, #bres, .cUnQKe`);
    var widgetsArray = Array.prototype.slice.call(widgets);
    widgetsArray.forEach(function (result) {
        if (result.tagName == 'H2' || result.tagName == 'SCRIPT') {
            /// Don't proccess
        } else if (result.tagName == 'HR') {
            // result.parentNode.removeChild(result);
            result.remove();
        } else if (result.clientHeight !== 0.0 && result.clientWidth !== 0.0 && result.firstChild !== undefined) {
            /// Search widget

            if (sidebarContainer !== null && sidebarHeight + result.clientHeight <= regularResultsColumn.scrollHeight) {
                /// Move widget to sidebar
                /// If sidebar height won't exceed regular results height, move tile there

                if (configs.tryToPlaceWidgetsOnTheSide) {
                    sidebarHeight += result.clientHeight;
                    result.style.marginTop = `${configs.externalPadding}px`;
                    sidebarNewChildrenContainer.appendChild(result);
                }
            } 
        } else {
            /// Remove bottom margin for empty divs on page
            result.style.margin = '0px';
            result.style.marginBottom = '0px';
        }
    })

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

    console.log('Google Tweaks finished proccessing page');
    return;

}

function hideNumberResultsRow() {
    /// Hides the 'number results found' line
    const appbar = document.getElementById('appbar');
    appbar.style.visibility = 'hidden';
    appbar.style.height = '0px';
    appbar.style.paddingTop = '42px';

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