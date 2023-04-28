function saveOptions(e) {
    e.preventDefault();
    
    chrome.storage.sync.set({
        settings: {
            businessAllowed: document.getElementById('businessAllowed').checked,
            whitelist: document.getElementById('whitelist').value
        }
    });
}

function restoreOptions() {
    function setSettings(result) {
        let settings = result.settings;

        document.getElementById('businessAllowed').checked = settings.businessAllowed;
        document.getElementById('whitelist').value = settings.whitelist;
    }
  
    function onError(error) {
        console.log(`Error: ${error}`);
    }
  
    chrome.storage.sync.get('settings').then(setSettings, onError);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
