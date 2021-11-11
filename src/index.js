/// CSS selectors
var regularResultClassName = 'g';
var searchFieldSelector = `[name = 'q']`;
var domainNameSelector = 'cite';
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
var scrollableCardSelector = `[role='listitem'], g-inner-card`;
var imagesPageImageSelector = `[class*='rg_i']`;
var newsPageCardSelector = 'g-card';
var shopPageCardClass = 'sh-dlr__list-result';
var regularCategoryButtonsParentId = 'hdtb-msb';
var regularCategoryButtonSelector = '.hdtb-mitem';
var imagesPageCategoryButtonsParentSelector = '.T47uwc';
var imagesPageCategoryButtonSelector = `[class*='NZmxZe']`;

/// Currently non-configurable variables
var sidebarPadding = 25;
var imageScaleUpOnHoverAmount = 1.5;
var loadPreviews = false;
var counterHintsOnBottom = false;
var paddingWhenNavbarMoved = 20;
var countedHintColor = 'grey';
var counterHintFocusColor = '#EA4335';
var topBar;
var tileTransition;

var tileBackgroundColor;
var hoverBackgroundColor;

var localDomain;

function loadConfigs() {
  let configKeys = Object.keys(configs);

  chrome.storage.local.get(
    configKeys, async function (value) {
      // configs.tilesEnabled = value.tilesEnabled ?? true;

      /// load configs
      for (let i = 0, n = configKeys.length; i < n; i++) {
        let key = configKeys[i];

        if (value[key] !== null && value[key] !== undefined)
          configs[key] = value[key];
      }

      if (document.body == null) await new Promise(resolve => setTimeout(resolve, 1));

      document.body.style.setProperty('--gtiles-tile-margin', configs.tilesEnabled ? `0px 0px ${configs.externalPadding}px` : '0px 0px 30px 0px');
      document.body.style.setProperty('--gtiles-topbar-max-height', configs.tilesEnabled && configs.moveNavbarToSearchbar ? `${paddingWhenNavbarMoved}px` : 'unset');

      if (configs.tilesEnabled) {
        tileTransition = `background-color ${configs.hoverTransitionDuration}ms ease-out`

        try {
          let color = hexToRgb(configs.tileBackgroundColor);
          tileBackgroundColor = `rgba(${color.red}, ${color.green}, ${color.blue},${configs.tileBackgroundOpacity})`;

          let hColor = hexToRgb(configs.hoverBackground);
          hoverBackgroundColor = `rgba(${hColor.red}, ${hColor.green}, ${hColor.blue}, ${configs.tileHoverBackgroundOpacity})`;
        } catch (e) {
          tileBackgroundColor = configs.tileBackgroundColor;
          hoverBackgroundColor = configs.hoverBackground;
        }

        document.body.style.setProperty('--gtiles-tile-background', configs.addTileBackground ? `${tileBackgroundColor}` : '');
        document.body.style.setProperty('--gtiles-tile-border', `solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'}`);
        document.body.style.setProperty('--gtiles-tile-border-radius', `${configs.borderRadius}px`);
        document.body.style.setProperty('--gtiles-transition', tileTransition);
        document.body.style.setProperty('--gtiles-tile-padding', `${configs.innerPadding}px`);
        document.body.style.setProperty('--gtiles-tile-shadow', configs.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})` : 'unset');
        document.body.style.setProperty('--gtiles-tile-width', configs.widerTiles ? '100%' : 'unset');
        document.body.style.setProperty('--gtiles-navbar-padding', `padding: 0px ${configs.innerPadding}px`);
        document.body.style.setProperty('--gtiles-counter-color', countedHintColor);
        document.body.style.setProperty('--gtiles-counter-opacity', configs.indexHintOpacity);
        document.body.style.setProperty('--gtiles-sidebar-width', `${configs.sidebarWidth}px`);
        document.body.style.setProperty('--gtiles-favicon-radius', `${configs.faviconRadius}px`);
        document.body.style.setProperty('--gtiles-sidebar-child-width', `${configs.sidebarWidth - (configs.innerPadding * 2)}px`);
        document.body.style.setProperty('--gtiles-tile-image-border-radius', `${configs.borderRadius}px ${configs.borderRadius}px 0px 0px`);
      }
    }
  )
}


function init() {
  if (configs.tilesEnabled) {

    console.time('Google Tiles finished proccessing page in');
    console.log('~~~')

    if (configs.moveNavbarToSearchbar)
      setTopBar();

    // if (configs.hideNumberResultsRow)
    //   hideNumberResultsRow();
    // removeSearchbarShadow();

    try {
      localDomain = window.location.href.substring(0, 30).split('/')[2];
      setLayout();

      // window.addEventListener('popstate', function () {
      //   setLayout();
      //   if (configs.debugMode) console.log('Google Tiles reproccessed updated page');
      // });

    } catch (error) {
      console.log('Google Tiles error:');
      console.log(error);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);

loadConfigs();

