// ==UserScript==
// @name         Better Google Search
// @namespace    http://tampermonkey.net/
// @version      3.0.01
// @description  Small tweaks to make Google Search page easier to use
// @homepageURL  https://github.com/emvaized/google-tiles-extension/tree/master
// @downloadURL  https://raw.githubusercontent.com/emvaized/google-tiles-extension/refs/heads/master/src/content.js
// @author       emvaized
// @license      GPLv3
// @match        https://www.google.com/search*
// @match        https://www.google.*.*/search*
// @match        https://www.google.*/search*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    // Settings
    const cfg = {
        'changeFavicon': true, // change favicon to magnifying glass icon
        'wrapResultsInLinks': true, // make whole search result clickable, like in Duck Duck Go
        'addKeyboardNavigation': true, // add keyboard navigation with arrow keys
        'removeHttps': false, // remove https:// and http:// from URLs
    }, keys = Object.keys(cfg);

    if (typeof chrome !== "undefined" && chrome.storage) {
        const loadedConfigs = await chrome.storage.sync.get(keys);
        if (loadedConfigs) keys.forEach(key => cfg[key] = loadedConfigs[key] ?? cfg[key])
    }

    // Variables
    const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <line x1="19.5" y1="19.5" x2="26" y2="26" stroke="#4285F4" stroke-width="5" stroke-linecap="round" />
    <path d="M 23 12 A 11 11 0 0 1 12 23 L 12 19 A 7 7 0 0 0 19 12 Z" fill="#4285F4" />
    <path d="M 12 23 A 11 11 0 0 1 1 12 L 5 12 A 7 7 0 0 0 12 19 Z" fill="#34A853" />
    <path d="M 1 12 A 11 11 0 0 1 12 1 L 12 5 A 7 7 0 0 0 5 12 Z" fill="#FBBC05" />
    <path d="M 12 1 A 11 11 0 0 1 23 12 L 19 12 A 7 7 0 0 0 12 5 Z" fill="#EA4335" />
    </svg>
    `;
    const newFaviconURL = `data:image/svg+xml,${encodeURIComponent(svgString)}`;

    const styleContent = `
        .g-tile{
            position: relative;
        }
        .g-tile:hover{
            text-decoration: none;
        }
        a.g-tile:hover > *{
            outline: 2px solid color-mix(in srgb, currentColor 25%, transparent);
            border-radius:4px;
            outline-offset: 4px;
        }
        .g-tile:focus-within a:has(> h3)::before{
            position:absolute; content: "";
            top: 10px; left: -40px;
            width: 15px; height: 15px;
            background: color-mix(in srgb, currentColor 25%, transparent);
            clip-path: polygon(0 0, 0 100%, 100% 50%);
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = styleContent;
    (document.head || document.documentElement).appendChild(styleElement);

    // Set favicon
    if (cfg.changeFavicon){
        setFavicon(newFaviconURL);
    }
    function setFavicon(url) {
        document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = url;
        document.head.appendChild(link);
    }

    // Make whole tile clickable
    let divs = document.querySelectorAll('.MjjYud'), divsLength = divs.length;
    // console.log(divs);
    if (divsLength < 1){
        divs = document.querySelectorAll('#rso > div:has(a)');
        divsLength = divs.length;
    }
    const keyboardNavigatableDivs = [];

    for (let i = 0; i < divsLength; i++){
        const tile = divs[i];

        if (!tile.isConnected) continue;
        if (!tile.clientHeight || tile.clientHeight < 1) continue;
        if (!tile.querySelector('h3')) continue; // exclude widgets
        if (tile.querySelector('mark')) continue; // exclude widgets

        const link = tile.querySelector('a');
        if (link){
            keyboardNavigatableDivs.push(tile);

            let linkWrapper;
            if (cfg.wrapResultsInLinks){
               linkWrapper = document.createElement('a');
               linkWrapper.href = link.href;
            } else{
                linkWrapper = document.createElement('div');
            }
            linkWrapper.className = 'g-tile';
            wrapNode(tile, linkWrapper);

            if (cfg.removeHttps){
                const urlText = tile.querySelector('cite');
                if (urlText){
                    urlText.innerText = urlText.innerText.replace('https://','').replace('http://','');
                }
            }
        }
    }
    function wrapNode(node, wrapper) {
        node.parentNode.insertBefore(wrapper, node);
        wrapper.appendChild(node);
    }

    // Add keyboard navigation
    if (cfg.addKeyboardNavigation){
        let focusedRegularResult = 0;
        focusSearchResult(0, false);

        document.addEventListener('keydown', function(e){
            if (document.activeElement.nodeName == 'TEXTAREA') return;

            if (e.keyCode == '38') {
                /// up arrow
                focusPrevResult();
            } else if (e.keyCode == '40') {
                /// down arrow
                focusNextResult();
            } else if (e.keyCode == '37') {
                /// left arrow
                goToPrevPage();
            } else if (e.keyCode == '39') {
                /// right arrow
                goToNextPage();
            } else if (e.keyCode == 32) {
                /// Spacebar
                e.preventDefault();
                document.activeElement.click();
                return;
            }
        })

        function focusPrevResult() {
            if (focusedRegularResult > 0) {
                focusSearchResult(focusedRegularResult -= 1);
            } else {
                focusSearchResult(keyboardNavigatableDivs.length - 1);
            }
        }
        function focusNextResult() {
            if (focusedRegularResult < keyboardNavigatableDivs.length - 1) {
                focusSearchResult(focusedRegularResult += 1);
            } else {
                focusSearchResult(0);
            }
        }
        function focusSearchResult(index, scrollIntoView = true){
            focusedRegularResult = index;
            const res = keyboardNavigatableDivs[index];
            if (res.parentNode.href) res.parentNode.focus();
                else res.querySelector('a:has(>h3)')?.focus();
            if (scrollIntoView) 
                keyboardNavigatableDivs[index].scrollIntoView({ block: 'center', inline: "nearest", behavior: "smooth" });
        }

        function goToPrevPage(){
            const prevPageButton = document.getElementById('pnprev');
            if (prevPageButton) prevPageButton.click();
        }
        function goToNextPage(){
            const nextPageButton = document.getElementById('pnnext');
            if (nextPageButton) nextPageButton.click();
        }
    }
})();