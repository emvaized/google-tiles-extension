/// Some CSS selectors
const regularResultClassName = 'g';
const searchFieldSelector = `[name = 'q']`;
const columnWithRegularResultsId = 'rso';

/// Variables to store calculated values
var ignoreClientHeightChanges = false;
let lastKnownBodyHeight;

/// Store results for keyboard navigation
const regularSearchResults = [];


loadConfigs();

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

      setVariables(configs);

      if (document.readyState === "complete" || document.readyState === 'interactive') init();
      else document.addEventListener('DOMContentLoaded', init);
    }
  );
}

function setVariables(cfg) {
  document.documentElement.style.setProperty('--gtiles-tile-border', `solid ${cfg.focusedBorderWidth}px ${cfg.addTileBorder ? cfg.borderColor : 'transparent'}`);
  document.documentElement.style.setProperty('--gtiles-tile-border-radius', `${cfg.borderRadius}px`);
  document.documentElement.style.setProperty('--gtiles-transition', `background-color ${cfg.hoverTransitionDuration}ms ease-out`);
  document.documentElement.style.setProperty('--gtiles-tile-shadow', cfg.shadowEnabled ? `0px 5px 15px rgba(0, 0, 0, ${cfg.shadowOpacity})` : 'unset');
  document.documentElement.style.setProperty('--gtiles-tile-width', cfg.widerTiles ? '100%' : 'unset');
  document.documentElement.style.setProperty('--gtiles-counter-color', 'grey');
  document.documentElement.style.setProperty('--gtiles-counter-opacity', cfg.indexHintOpacity);
  document.documentElement.style.setProperty('--gtiles-sidebar-width', cfg.tryToPlaceWidgetsOnTheSide ? `${cfg.sidebarWidth}px` : 'revert');
  document.documentElement.style.setProperty('--gtiles-tile-padding', `${cfg.innerPadding}px`);
  document.documentElement.style.setProperty('--gtiles-tile-margin', `0px 0px ${cfg.externalPadding}px`);
  document.documentElement.style.setProperty('--gtiles-tile-external-padding', `${1.0 * cfg.externalPadding + 1.0 * cfg.innerPadding}px`);
  document.documentElement.style.setProperty('--gtiles-tile-hover-title-color', cfg.titleHoverColor);
  document.documentElement.style.setProperty('--gtiles-keyboard-focus-border-color', cfg.keyboardFocusBorderColor);
  document.documentElement.style.setProperty('--gtiles-focused-tile-dot-opacity', cfg.focusedTileDotOpacity);
  document.documentElement.style.setProperty('--gtiles-results-found-line-visibility', cfg.hideNumberResultsRow ? 'hidden' : 'visible');
  document.documentElement.style.setProperty('--gtiles-results-found-line-height', cfg.hideNumberResultsRow ? '10px' : 'unset');
  document.documentElement.style.setProperty('--gtiles-results-found-border-visibility', cfg.hideNumberResultsRowBorder ? 'hidden' : 'visible');

  /// Calculate background color for tiles
  let tileBackgroundColor, hoverBackgroundColor;
  try {
    const color = hexToRgb(cfg.tileBackgroundColor);
    tileBackgroundColor = `rgba(${color.red}, ${color.green}, ${color.blue},${cfg.tileBackgroundOpacity})`;

    const hColor = hexToRgb(cfg.hoverBackground);
    hoverBackgroundColor = `rgba(${hColor.red}, ${hColor.green}, ${hColor.blue}, ${cfg.tileHoverBackgroundOpacity})`;
  } catch (e) {
    tileBackgroundColor = cfg.tileBackgroundColor;
    hoverBackgroundColor = cfg.hoverBackground;
  }
  document.documentElement.style.setProperty('--gtiles-tile-background-color', cfg.addTileBackground ? tileBackgroundColor : 'transparent');
  document.documentElement.style.setProperty('--gtiles-tile-hover-background-color', hoverBackgroundColor);

  /// Move sidebar widgets on top of page
  if (cfg.tryToPlaceWidgetsOnTheSide && cfg.moveTopPhotosToSidebar) document.body.classList.add('gtile-move-top-photos')

  /// Hide 'translate this result' buttons
  if (cfg.hideTranslateResultButton) document.body.classList.add('gtile-hide-translate-result')
}

function init() {
  try {
    // setRegularResults()
    // setSidebar();
    Promise.all([setRegularResults(), setLayout()])
  } catch (error) {
    console.log('Google Tiles error:');
    console.log(error);
  }
}

function setLayout(){
  setSidebar();

   /// Set keyboard listeners
   if (configs.navigateWithKeyboard || configs.numericNavigation) {
    setTimeout(() => setKeyboardHandlers(regularResultsColumn, sidebarContainer, []), 1);
  }

  let lastKnownBodyHeight;
  let resizeObserverTimeout;

  // Create an Observer instance
  const resizeObserver = new ResizeObserver(function(entries) { 
    if (ignoreClientHeightChanges) return;

    clearTimeout(resizeObserverTimeout);
    resizeObserverTimeout = setTimeout(function(){
      if (ignoreClientHeightChanges) return;

      if (entries[0].target.clientHeight > lastKnownBodyHeight) {
        // console.log('Body height changed:', entries[0].target.clientHeight - lastKnownBodyHeight)
        lastKnownBodyHeight = entries[0].target.clientHeight;
        setRegularResults(true);

        if (configs.moveLazyLoadedWidgets) {
          setSidebar(true);
          setTimeout(function(){
            ignoreClientHeightChanges = false;
            setRegularResults(true);
          }, 2)
        }
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