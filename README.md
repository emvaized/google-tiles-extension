# <sub><img src="./icons/google-tiles-new-icon-48.png" height="48" width="48"></sub> Google Tweaks

Customize the looks and behavior of Google search page for better productivity

* Make whole search result clickable and interactive (just like in DuckDuckGo)
* Make search results look and behave like cards, with configurable border radius, shadows, colors and so on
* Extended keyboard navigation with arrow keys and number keys
* Utilize horizontal screen space and scroll less by moving search widgets to the right sidebar, basically getting 2-column view

<a href="https://chrome.google.com/webstore/detail/google-tiles/cjbgjibpaopnjfbhipjfckeodbaednbg">Download for Chrome</a>


<a href="https://addons.mozilla.orgfirefox/addon/google-tiles/">Download for Firefox</a>


---

<strong>Note about "all tabs" permission</strong>

Although browser may mark this addon as requiring access to all opened tabs, in fact it is not. It uses <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts#include_globs">include_globs</a> manifest key to gain access only to Google search page and all it's local variations (such as "www.google.es", "google.com.ua" etc). 

This addon doesn't have access to any other pages you open, which you can verify by checking the extensions dropdown in the toolbar. This confusion comes from limitations of <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts#matches">matches</a> manifest key, which doesn't support precise subdomain matching.

---

### Support
If you really enjoy this product, consider supporting it's further development with a small donation! 

<a href="https://ko-fi.com/emvaized"><img src="https://user-images.githubusercontent.com/7586345/125668092-55af2a45-aa7d-4795-93ed-de0a9a2828c5.png" alt="Support on Ko-fi" height="35"></a>    <a href="https://www.paypal.com/donate/?business=2KDNGXNUVZW7N&no_recurring=0&currency_code=USD"><img src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif" height="35"/></a> 
