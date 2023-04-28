function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
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
  
    let getting = browser.storage.sync.get("whitelist");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
