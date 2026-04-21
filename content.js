let crashHistory = [];
let observer = null;

const initScraper = () => {
    chrome.storage.local.get(['crashHistory'], (res) => {
        crashHistory = res.crashHistory || [];
    });

    const findTable = setInterval(() => {
        const headers = Array.from(document.querySelectorAll('th'));
        const resultHeader = headers.find(h => h.innerText.includes('Result'));
        if (resultHeader) {
            const tbody = resultHeader.closest('table')?.querySelector('tbody');
            if (tbody) {
                startObserving(tbody);
                clearInterval(findTable);
            }
        }
    }, 1500);
};

const startObserving = (target) => {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'TR') {
                    const cells = node.querySelectorAll('td');
                    if (cells.length >= 2) {
                        processNewResult(cells[1].innerText.trim(), cells[0].innerText.trim());
                    }
                }
            });
        });
    });
    observer.observe(target, { childList: true });
};

const processNewResult = (val, id) => {
    const num = parseFloat(val);
    if (isNaN(num) || (crashHistory.length > 0 && crashHistory[0].id === id)) return;

    crashHistory.unshift({ val: num, id, time: new Date().toISOString() });
    if (crashHistory.length > 500) crashHistory.pop();

    chrome.storage.local.set({ crashHistory }, () => {
        chrome.runtime.sendMessage({ type: "NEW_ENTRY", count: crashHistory.length }).catch(() => {});
    });
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "RESET_DATA") {
        crashHistory = [];
        chrome.storage.local.set({ crashHistory: [] }, () => sendResponse({ success: true }));
        return true;
    }
});

initScraper();