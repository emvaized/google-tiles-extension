# <sub><img src="./icons/icon-new.png" height="48" width="48"></sub> Google Tweaker

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


## Building
- `npm install` to install all dependencies
- `npm run build` to generate `dist` folder with minimized code of the extension

## Support
If you really enjoy this product, please consider supporting its further development by making a small donation! 

Ko-Fi <br>
<a href="https://ko-fi.com/emvaized"><img src="https://user-images.githubusercontent.com/7586345/125668092-55af2a45-aa7d-4795-93ed-de0a9a2828c5.png" alt="Support on Ko-fi" height="35"></a>   

PayPal <br>
<a href="https://www.paypal.com/donate/?business=2KDNGXNUVZW7N&no_recurring=0&currency_code=USD"><img src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif" height="35" width="70"/></a> 
