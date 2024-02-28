/// Some CSS selectors
const regularResultClassName = 'g';
const searchFieldSelector = `[name = 'q']`;
const columnWithRegularResultsId = 'rso';
const regularCategoryButtonsParentId = 'hdtb-msb';

/// Currently non-configurable variables
const sidebarPadding = 25;
const counterHintsOnBottom = false;
const paddingWhenNavbarMoved = 20;
const countedHintColor = 'grey';
const counterHintFocusColor = '#EA4335';

/// Variables to store calculated values
var tileTransition;
var tileBackgroundColor;
var hoverBackgroundColor;

/// Store results for keyboard navigation
const regularSearchResults = [];


function loadConfigs() {
  const configKeys = Object.keys(configs);

  chrome.storage.local.get(
    configKeys, async function (value) {
      // configs.tilesEnabled = value.tilesEnabled ?? true;

      /// load configs
      for (let i = 0, n = configKeys.length; i < n; i++) {
        let key = configKeys[i];

        if (value[key] !== null && value[key] !== undefined)
          configs[key] = value[key];
      }

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

        setVariables();

        if (document.readyState === "complete" || document.readyState === 'interactive') init();
        else document.addEventListener('DOMContentLoaded', init);
      }
    }
  );

}

function setVariables() {
  document.documentElement.style.setProperty('--gtiles-tile-background', configs.addTileBackground ? `${tileBackgroundColor}` : '');
  document.documentElement.style.setProperty('--gtiles-tile-border', `solid ${configs.focusedBorderWidth}px ${configs.addTileBorder ? configs.borderColor : 'transparent'}`);
  document.documentElement.style.setProperty('--gtiles-tile-border-radius', `${configs.borderRadius}px`);
  document.documentElement.style.setProperty('--gtiles-transition', tileTransition);
  document.documentElement.style.setProperty('--gtiles-tile-shadow', configs.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${configs.shadowOpacity})` : 'unset');
  document.documentElement.style.setProperty('--gtiles-tile-width', configs.widerTiles ? '100%' : 'unset');
  document.documentElement.style.setProperty('--gtiles-counter-color', countedHintColor);
  document.documentElement.style.setProperty('--gtiles-counter-opacity', configs.indexHintOpacity);
  document.documentElement.style.setProperty('--gtiles-sidebar-width', `${configs.sidebarWidth}px`);
  // document.documentElement.style.setProperty('--gtiles-navbar-padding', `padding: 0px ${configs.innerPadding}px`);
  // document.documentElement.style.setProperty('--gtiles-favicon-radius', `${configs.faviconRadius}px`);
  document.documentElement.style.setProperty('--gtiles-tile-padding', `${configs.innerPadding}px`);
  document.documentElement.style.setProperty('--gtiles-tile-margin', configs.tilesEnabled ? `0px 0px ${configs.externalPadding}px` : '0px 0px 30px 0px');
  document.documentElement.style.setProperty('--gtiles-tile-external-padding', configs.tilesEnabled ? `${1.0 * configs.externalPadding + 1.0 * configs.innerPadding}px` : 'unset');

  document.documentElement.style.setProperty('--gtiles-tile-background-color', configs.addTileBackground ? tileBackgroundColor : 'transparent');
  document.documentElement.style.setProperty('--gtiles-tile-hover-background-color', hoverBackgroundColor);
  document.documentElement.style.setProperty('--gtiles-tile-hover-title-color', configs.titleHoverColor);

  document.documentElement.style.setProperty('--gtiles-keyboard-focus-border-color', configs.keyboardFocusBorderColor);
  document.documentElement.style.setProperty('--gtiles-focused-tile-dot-opacity', configs.focusedTileDotOpacity);

  document.documentElement.style.setProperty('--gtiles-results-found-line-visibility', configs.hideNumberResultsRow ? 'hidden' : 'visible');
  document.documentElement.style.setProperty('--gtiles-results-found-line-height', configs.hideNumberResultsRow ? '10px' : 'unset');
  document.documentElement.style.setProperty('--gtiles-results-found-border-visibility', configs.hideNumberResultsRowBorder ? 'hidden' : 'visible');

}

let lastKnownBodyHeight;

function init() {
  // if (configs.moveNavbarToSearchbar)
  //   setTopBar();

  try {
    // setRegularResults()
    // setLayout();
    Promise.all([setRegularResults(), setLayout()])
  } catch (error) {
    console.log('Google Tiles error:');
    console.log(error);
  }

  /// Set keyboard listeners
  if (configs.navigateWithKeyboard || configs.numericNavigation) {
    setTimeout(() => setKeyboardHandlers(regularResultsColumn, sidebarContainer, []), 1);
  }

  let lastKnownBodyHeight;
  let resizeObserverTimeout;

  // Create an Observer instance
  const resizeObserver = new ResizeObserver(function(entries) { 
    clearTimeout(resizeObserverTimeout);
    resizeObserverTimeout = setTimeout(function(){

      if (entries[0].target.clientHeight > lastKnownBodyHeight) {
        // console.log('Body height changed:', entries[0].target.clientHeight - lastKnownBodyHeight)
        lastKnownBodyHeight = entries[0].target.clientHeight;
        setRegularResults(true);
        // setLayout(true);
      }
    }, 100)
  })

  /// Start observing body for changed height
  /// Initiate heavy observer only after first scroll event
  document.addEventListener('scroll', onFirstScroll)

  function onFirstScroll(){
    if (window.scrollY > 300) {
      document.removeEventListener('scroll', onFirstScroll)
      lastKnownBodyHeight = document.body.clientHeight;
      resizeObserver.observe(document.body)
    }
  }
}

loadConfigs();
