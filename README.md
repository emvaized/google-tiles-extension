# <sub><img src="./icons/icon-new.png" height="48" width="48"></sub> Google Search Tweaker (tiled google search)

Customize the looks and behavior of Google search page for better productivity

* Make whole search result clickable and interactive (just like in DuckDuckGo)
* Make search results look and behave like cards, with configurable border radius, shadows, colors and so on
* Extended keyboard navigation with arrow keys and number keys
* Utilize horizontal screen space and scroll less by moving search widgets to the right sidebar, basically getting 2-column view


Firefox (>109.0) <br>
<a href="https://addons.mozilla.org/firefox/addon/google-tiles/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get for Firefox"></a>

Chrome (Edge, Brave, Vivaldi etc) <br> 
<a href="https://chrome.google.com/webstore/detail/google-tiles/cjbgjibpaopnjfbhipjfckeodbaednbg"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get for Chrome"></a>


## Note about "all tabs" permission

Although browser may mark this addon as requiring access to all opened tabs, in fact it is not. It uses <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts#include_globs">include_globs</a> manifest key to gain access only to Google search page and all it's local variations (such as "www.google.es", "google.com.ua" etc). 

This addon doesn't have access to any other pages you open, which you can verify by checking the extensions dropdown in the toolbar. This confusion comes from limitations of <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts#matches">matches</a> manifest key, which doesn't support precise subdomain matching.

## Support
If you really enjoy this product, please consider supporting its further development by making a small donation! 

<a href="https://ko-fi.com/emvaized"><img src="https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/64f1a9ddd0246590df69ea0b_kofi_long_button_red%25402x-p-800.png" alt="Support on Ko-fi" height="40"></a> &nbsp; <a href="https://liberapay.com/emvaized/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg" height="40"></a> &nbsp; <a href="https://emvaized.github.io/donate/bitcoin/"><img src="https://github.com/emvaized/emvaized.github.io/blob/main/donate/bitcoin/assets/bitcoin-donate-button.png?raw=true" alt="Donate Bitcoin" height="40" /></a> 

## Building
- `npm install` to install all dependencies
- `npm run build` to generate `dist` folder with minimized code of the extension
