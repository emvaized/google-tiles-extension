/// CSS selectors
var regularResultClassName = 'g';
var searchFieldSelector = `[name = 'q']`;
var resultStatsSelector = `[id='result-stats']`;
var navBarSelector = `[id='top_nav']`;
var domainNameSelector = `cite`;
var dropdownMenuSelector = `[class='action-menu']`;
var translatePageButtonSelector = `[class*='fl ']`;
var columnWithRegularResultsId = 'rso';
var columnWithImagePageResultsId = 'islrg';
var peopleAlsoSearchForId = 'botstuff';
var imageResultTileSelector = `[class$='ivg-i']`;
var imageCarouselClass = 'GNxIwf';
var interactiveWidgetSelector = `[class$='vk_c']`;
var nextResultsPageButtonId = 'pnnext';
var previousResultsPageButtonId = 'pnprev';
var scrollableCardSelector = `g-inner-card`;
var imagesPageImageSelector = `[class*='rg_i']`;
var newsPageCardSelector = 'g-card';
var shopPageCardClass = 'sh-dlr__list-result';
var regularCategoryButtonsParentSelector = '#hdtb-msb';
var regularCategoryButtonsParentId = 'hdtb-msb';
var regularCategoryButtonSelector = '.hdtb-mitem';
var imagesPageCategoryButtonsParentSelector = '.T47uwc';
var imagesPageCategoryButtonSelector = `[class*='NZmxZe']`;

/// Currently non-configurable variables
var sidebarPadding = 25;
var imageScaleUpOnHoverAmount = 1.5;
var loadPreviews = false;
var counterHintsOnBottom = true;
var countedHintColor = 'grey';
var counterHintFocusColor = '#EA4335';


function loadConfigs() {
  let configKeys = Object.keys(configs);

  chrome.storage.local.get(
    configKeys, function (value) {
      configs.tilesEnabled = value.tilesEnabled ?? true;

      document.body.style.setProperty('--gtiles-tile-margin', configs.enabled ? `0px 0px ${configs.externalPadding}px` : '0px 0px 30px 0px');

      if (configs.tilesEnabled) {

        /// load configs
        for (var i = 0; i < configKeys.length; i++) {
          let key = configKeys[i];

          if (value[key] !== null && value[key] !== undefined)
            configs[key] = value[key];
        }

        /// set styles
        document.body.style.setProperty('--gtiles-tile-background', configs.addTileBackground ? `${configs.tileBackgroundColor}` : '');
        document.body.style.setProperty('--gtiles-tile-border', `solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'}`);
        document.body.style.setProperty('--gtiles-tile-border-radius', `${configs.borderRadius}px`);
        document.body.style.setProperty('--gtiles-transition', `all ${configs.hoverTransitionDuration}ms ease-out`);
        document.body.style.setProperty('--gtiles-tile-padding', `${configs.innerPadding}px`);
        document.body.style.setProperty('--gtiles-tile-shadow', configs.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})` : 'unset');
        document.body.style.setProperty('--gtiles-tile-width', configs.widerTiles ? '100%' : 'unset');
        document.body.style.setProperty('--gtiles-navbar-padding', `padding: 0px ${configs.innerPadding}px`);

        document.body.style.setProperty('--gtiles-counter-color', countedHintColor);
        document.body.style.setProperty('--gtiles-counter-opacity', configs.indexHintOpacity);

      }
    }
  )
}


function init() {
  if (configs.tilesEnabled) {

    var mainResults = document.getElementById(columnWithRegularResultsId);

    try {

      if (mainResults !== null) {

        /// Regular results handling
        if (mainResults.children.length == 1)
          mainResults = Array.prototype.slice.call(mainResults.firstChild.children);
        else
          mainResults = Array.prototype.slice.call(mainResults.children);

        /// Handling when cards are wrapped in div 
        //             if (mainResults.length <= 8)
        mainResults.forEach(function (result) {

          if (result.className == 'g') {
            if (configs.addFavicons || configs.simplifyDomain) {
              configureTileHeader(result, result.querySelector('a').href)
            }
          } else {
            let ch = result.children;

            ch = Array.prototype.slice.call(ch);

            if (ch !== null && ch !== undefined && ch !== []) {
              var regularResultsColumnElement = document.getElementById(columnWithRegularResultsId);
              ch.forEach(function (c) {

                if (c.className == 'g') {
                  mainResults.push(c);
                  // regularResultsColumnElement.appendChild(c);

                  if (configs.addFavicons || configs.simplifyDomain) {
                    configureTileHeader(c, c.querySelector('a').href)
                  }
                }
              })
            }
          }


        })

        /// Special handling for news results page
        if (mainResults.length == 2) {
          var newsMainResults = mainResults[0].querySelectorAll(newsPageCardSelector);
          newsMainResults = Array.prototype.slice.call(newsMainResults);

          mainResults[1].firstChild.style.cssText = 'overflow-x: auto !important';
          newsMainResults.push(mainResults[1]);
          mainResults = newsMainResults;
        }
        else if (mainResults.length <= 5) {
          /// Special handling for shop page (quite a shaky way to determine - desirably to rewrite)
          var newsMainResults = document.getElementById(columnWithRegularResultsId).querySelectorAll(`.${shopPageCardClass}`);
          newsMainResults = Array.prototype.slice.call(newsMainResults);
          mainResults = newsMainResults;
        }

        setLayout(mainResults);



      } else {
        /// Image page results handling (all proccessing done inside method)

        // var container = document.getElementById('islrg');
        // var images = container.firstChild.children;

        setLayout();
      }


    } catch (error) {
      console.log('Google Tiles error:');
      console.log(error);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);

loadConfigs();

