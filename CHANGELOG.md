### 2.5.7
- Added config for spacebar action (select focused, scroll to next, none)
- Changed extension name to "Google Search Tweaker"
- Excluded non "all results" search tabs from proccessing to avoid problems

### 2.5.6
- Bring back the ability to switch pages with left and right arrow keys

### 2.5.5
- Migrated to Manifest V3 to comply with new Chrome Web Store requirements
- Released code is now minified, and extension should now become much faster and lighter
- Slightly updated extension icon

### 2.5.2
- Added option to hide 'translate this result' button
- Extended list of supported widgets moved to sidebar
- Fix for scripts not working on some pages
- Improved tiles alignment with the searchbox on top
- Project cleanup and performance optimizations

### 2.5.1
- Changed extension name to "Google Tweaks"
- Compatibility with more Google search widgets
- Added option to not proccess widgets if window is too narrow (on by default)
- "Sidebar width" option now applies to Google's own sidebar as well
- Removed option to place normal search results in sidebar, as it makes no sense now with lazy loading list, and actually breaks it

### 2.5.0
- Added test support for new Google lazy loading of next search page
- New option to remove "n results found" line on top, as well as it's border
- Huge refactoring and optimization of the project – it became much lighter and faster to load
- Some of the features had to be removed ("Add website favicons", "Apply styling to the search widgets", "Move search results on top", "Numbers navigate tabs", horizontal arrows keyboard navigation). Some of these, which are still actual in new lazy-loaded layout, may be reimplemented in the future if there will be demand from users 
- Changed website check to a more flexible form, so that it should support more google.com subdomains

### 2.4.3
- Small fixes
- Changed defaults to disable configs which are not working anymore

### 2.4.2
- Disable code for removing the 'globe' favicon, because of false detections
- Update id 'people also search for' element
- Fix positioning when moving navigation butons to the top bar

### 2.4.1
- Added Dutch translation
- Use space bar to focus next search result

### 2.4.0
- Fixed issue of extension not working on some pages
- Removed unstable hover features

### 2.3.9
- Fixed misplaced favicon+site headers in youtube search result tiles
- Changed support/donate link to Ko-Fi
- Fixed non-displayed icons in the extension popup

### 2.3.8
- Fix favicons shifted after new Google CSS updates

### 2.3.7
- Fix for first news tile image overflowing
- Fix for non-working favicons
- Fix favicon loading spinner not displaying in Firefox

### 2.3.6
- Fix for non-working 'color of title on hover'
- Remove the favicon when it's default globe icon
- Fix non-proccessed page on returning back from result page
- Changed extension name to "Google Tweaks"
- Other small fixes & improvements

### 2.3.5
- Removed FaviconKit favicons
- Fixed some configs not working + not affecting tile preview on options page
- Other small fixes and improvements

### 2.3.4
- Small css improvements

### 2.3.3
- Added 'tile opacity' parameter
- Removed link underline for grid-like search results
- Fixed non-proccessed regular results tiles

### 2.3.2
- Fix non-processed headers for 'g' card wrapped in another 'g' card
- Fix for 'populate sidebar with regular results' being always on
- Other small fixes

### 2.3.1
- Added support for more local Google domains
- Layout fixes and improvements

### 2.3.0
- Improved 'populate sidebar with regular results' functionality
- Added option to configure populated results position (top/bottom)
- Improved favicons search
- Added loading spinner when loading favicons
- Favicons are now aligned with title
- Fixed for 'Apply style to widgets' not disabling correctly
- Small fixes for extension settings
- Various performance and layout improvements

### 2.2.8 
- Improved short header calculation
- Improved 'move category buttons on top' option
- Improved grid-link cards proccessing
- Added 'populate sidebar with regular results' option

### 2.2.7
- Changed extension name
- Fix for favicon size not being applied
- Performance improvements
- Added links to popup

### 2.2.6
- Crucial fixes after recent Google search page HTML update

### 2.2.5
- Fix for misplaced tile index hints

### 2.2.4
- Fix for styles not being applied to excerpt widgets

### 2.2.3
- Added rounded corners on top for maps widget image
- Fix for wrong index highlighted on numeric navigation for categories
- Fix for layout issue with 'table' search tile
- Fix for news page not working + broken 'buy' page layout

### 2.2.2
- Great performance improvements by moving part of styling to css
- Changed configs for sidebar width for precise pixels

### 2.2.1
- Fix for search suggestions widget being stylized twice
- Fix for external padding setting not being applied
- Added version number and 'what's new' in ф popup

### 2.2.0
- Implemented new feature 'Move navbar to searchbar'
- Great performance improvements
- Favicons now should load faster
- Project restructured
- Changed extension name to 'G-Tiles'
- Added setting 'Change cursor over tile to pointer'
- Fixed issues on settings page

### 2.1.7
- Fixed layout issues for some search queries

### 2.1.6
- Improved favicon searching
- Fixed layout issues for some search queries

### 2.1.5
- Fix for missing favicon for GitHub
- Added Spanish and French translation (Google Translate)
- Added version number on bottom of extension settings
- Added LICENSE

### 2.1.4
- Fix for broken layout on some pages
- New 'Add dot to focused tile' option
- Refactored extension configs and project structure
- Updated extension icon
- Small bug fixes and improvements

### 2.1.3
- Disabled 'whole-title-clickable' behavior for tiles with accordion widgets
- Implemented some ad banners handling
- Implemented collapsible headers in settings
- Changed some default settings (disabled keyboard navigation by default)

### 2.1.2
- Disabled adding on-click links for search widgets to avoid usability issues
- Changed default settings for some params
- Fixed width for search widgets 
- Added option to disable centerizing tile focused by arrow keys

### 2.1.1
- Bug fixes

### 2.1
- Added feature 'Colorize border after favicon'
- Added feature 'Scale up focused result'
- Added support for more local domains
- Added ability to disable tile background color and focused tile border color

### 2.0
Project refactored in order to fix bugs and optimize performance

New features:
- Configurable sidebar width
- Added feature to change title color on hover
- Ability to disable tile background color
- Added second numeric navigation approach (switch search categories)
- Left/right arrow keys now switch search pages
- Updated settings labels