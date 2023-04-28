function onError(error) {
    console.log(`Error: ${error}`);
}
  
function onGot(item) {
    if (item.whitelist) {
        whitelist = item.whitelist.split('\n');
    }
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
        
        const user = verifiedTweet.closest('[href]');
        if (user) {
            const username = user.getAttribute('href').replace('/', '').toLowerCase();
            if (whitelist.includes(username)) {
                return;
            }
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
    element.src = userBrowser.runtime.getURL("images/acc_add.png");
    element.style.width = "20px";
    element.style.maxWidth = "20px";
    element.style.height = "20px";
    element.style.maxHeight = "20px";
    element.style.margin = "0 0 1px 5px";

    element.addEventListener('click', function (e) {
        whitelist.push(username);

        userBrowser.storage.sync.set({
            whitelist: whitelist.join('\n')
        });

        location.reload();
    });

    return element;
}


function addWhitelistRemoveIcon(username, lastChild) {
    const element = document.createElement('img');
    element.className = lastChild.className;
    element.src = userBrowser.runtime.getURL("images/acc_remove.png");
    element.style.width = "30px";
    element.style.maxWidth = "30px";
    element.style.height = "30px";
    element.style.maxHeight = "30px";
    element.style.margin = "0 0 6px 0";

    element.addEventListener('click', function (e) {
        whitelist = whitelist.filter(item => item != username);

        userBrowser.storage.sync.set({
            whitelist: whitelist.join('\n')
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

    const username = getUsernameFromURL();
    const lastChild = usernameBlock.lastChild;

    let element;
    if (whitelist.includes(username)) {
        element = addWhitelistRemoveIcon(username, lastChild);
    } else {
        element = addWhitelistAddIcon(username, lastChild);
    }

    usernameBlock.appendChild(element);
}


var whitelist = [];

const userBrowser = (function () {
    return window.chrome ||
        window.msBrowser ||
        window.browser ||
        browser;
})();

const getting = userBrowser.storage.sync.get('whitelist');
getting.then(onGot, onError);

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
