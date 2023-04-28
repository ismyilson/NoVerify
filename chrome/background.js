
async function onInstalled(details) {
    let defaultSettings = {
        businessAllowed: false,
        whitelist: ""
    };

    const storedSettings = await chrome.storage.sync.get({
        settings: defaultSettings
    });

    await chrome.storage.sync.set(storedSettings);
}

chrome.runtime.onInstalled.addListener(onInstalled);
