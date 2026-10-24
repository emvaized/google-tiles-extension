document.addEventListener('DOMContentLoaded', function() {
    const cfgs = {
        'changeFavicon': true,
        'wrapResultsInLinks': true,
        'addKeyboardNavigation': true,
        'removeHttps': false,
    }, keys = Object.keys(cfgs);

    chrome.storage.sync.get(keys,(configs) => {
        keys.forEach((key) => {
            const input = document.getElementById(key);
            if (input){
                input.checked = configs[key] ?? cfgs[key];
                input.addEventListener('change', function() {
                    chrome.storage.sync.set({ [key]: this.checked });
                });

                /// translate label
                const translatedLabel = chrome.i18n.getMessage(key);
                if (translatedLabel) input.parentNode.querySelector('label').innerText = translatedLabel;
            }
        })
    });

    const hintTranslation = chrome.i18n.getMessage('refreshHint');
    if (hintTranslation) document.getElementById('refreshHint').innerText = '⚠ ' + hintTranslation;
});