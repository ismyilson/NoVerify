function onError(error) {
    console.log(`Error: ${error}`);
}

function onGetSettings(result) {
    result = result.settings;
    settings = {
        businessAllowed: result.businessAllowed,
        whitelist: result.whitelist.split('\n')
    }

    start();
}

function isBusinessVerified(verifiedTag) {
    return verifiedTag.firstChild.childElementCount > 1;
}

function removeIfVerified(node) {
    const verified = node.querySelectorAll('[data-testid="icon-verified"]');
    if (verified.length <= 0) {
        return;
    }

    verified.forEach((verifiedTweet) => {
        const block = verifiedTweet.closest('[data-testid="cellInnerDiv"]');
        if (!block) {
            return;
        }
        
        // Check if user is whitelisted
        const user = verifiedTweet.closest('[href]');
        if (user) {
            const username = user.getAttribute('href').replace('/', '').toLowerCase();
            if (settings.whitelist.includes(username)) {
                return;
            }
        }

        // Check if we allow business
        if (settings.businessAllowed && isBusinessVerified(verifiedTweet)) {
            return;
        }

        block.firstChild?.remove();
    });
}

function getUsernameFromURL() {
    const search = '.com';
    const url = window.location.toString();
    const endIndex = url.indexOf(search) + search.length + 1;
    const substr = url.substring(endIndex).toLowerCase();

    const slashIndex = substr.indexOf('/');
    if (slashIndex != -1) {
        return substr.substring(0, slashIndex);
    }

    const paramsIndex = substr.indexOf('?');
    if (paramsIndex != -1) {
        return substr.substring(0, paramsIndex);
    }

    return substr;
}

function addWhitelistAddIcon(username, lastChild) {
    const element = document.createElement('img');
    element.className = lastChild.className;
    element.src = chrome.runtime.getURL("images/acc_add.png");
    element.style.width = "20px";
    element.style.maxWidth = "20px";
    element.style.height = "20px";
    element.style.maxHeight = "20px";
    element.style.margin = "0 0 1px 5px";

    element.addEventListener('click', function (e) {
        settings.whitelist.push(username);

        chrome.storage.sync.set({
            settings: {
                whitelist: settings.whitelist.join('\n')
            }
        });

        location.reload();
    });

    return element;
}

function addWhitelistRemoveIcon(username, lastChild) {
    const element = document.createElement('img');
    element.className = lastChild.className;
    element.src = chrome.runtime.getURL("images/acc_remove.png");
    element.style.width = "30px";
    element.style.maxWidth = "30px";
    element.style.height = "30px";
    element.style.maxHeight = "30px";
    element.style.margin = "0 0 6px 0";

    element.addEventListener('click', function (e) {
        settings.whitelist = settings.whitelist.filter(item => item != username);

        chrome.storage.sync.set({
            settings: {
                whitelist: settings.whitelist.join('\n')
            }
        });

        location.reload();
    });

    return element;
}

function addWhitelistIconIfUserPanel(node) {
    const userBlock = node.querySelectorAll('[data-testid="UserName"]');
    if (userBlock.length <= 0) {
        return;
    }

    const usernameBlock = userBlock[0].querySelector('span');
    if (!usernameBlock) {
        return;
    }

    // Check if lastChild is verified tag
    const lastChild = usernameBlock.lastChild;
    const verifiedTag = lastChild.querySelector('[data-testid="icon-verified"]');
    if (!verifiedTag) {
        return;
    }

    const username = getUsernameFromURL();

    let element;
    if (settings.whitelist.includes(username)) {
        element = addWhitelistRemoveIcon(username, lastChild);
    } else {
        if (settings.businessAllowed && isBusinessVerified(verifiedTag)) {
            return;
        }

        element = addWhitelistAddIcon(username, lastChild);
    }

    usernameBlock.appendChild(element);
}

function start() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const newNode = mutation.addedNodes[i];
                    removeIfVerified(newNode);
                    addWhitelistIconIfUserPanel(newNode);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

var settings = {};
chrome.storage.sync.get('settings').then(onGetSettings, onError);
