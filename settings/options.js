function saveOptions(e) {
    e.preventDefault();
    userBrowser.storage.sync.set({
        whitelist: document.querySelector("#whitelist").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#whitelist").value = result.whitelist;
    }
  
    function onError(error) {
        console.log(`Error: ${error}`);
    }
  
    let getting = userBrowser.storage.sync.get("whitelist");
    getting.then(setCurrentChoice, onError);
}

const userBrowser = (function () {
    return window.chrome ||
        window.msBrowser ||
        window.browser ||
        browser;
})();

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
