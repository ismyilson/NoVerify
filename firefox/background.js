
async function onInstalled(details) {
    let defaultSettings = {
        businessAllowed: false,
        whitelist: ""
    };

    const storedSettings = await browser.storage.sync.get({
        settings: defaultSettings
    });

    await browser.storage.sync.set(storedSettings);
}

browser.runtime.onInstalled.addListener(onInstalled);
