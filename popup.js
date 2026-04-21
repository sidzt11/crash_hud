document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('history-body');
    const btnReset = document.getElementById('btn-reset');
    const p2 = document.getElementById('prob-2x');
    const p3 = document.getElementById('prob-3x');
    const p5 = document.getElementById('prob-5x');
    const status = document.getElementById('algo-status');

    const updateUI = () => {
        chrome.storage.local.get(['crashHistory'], (res) => {
            const hist = res.crashHistory || [];
            tableBody.innerHTML = hist.map(e => `<tr><td>${new Date(e.time).toLocaleTimeString()}</td><td class="${e.val >= 2 ? 'high' : 'low'}">${e.val.toFixed(2)}x</td></tr>`).join('');
            
            const N = hist.length;
            if (N < 30) {
                status.className = "status-bar status-red";
                status.innerText = `WARM UP: ${N}/30`;
                p2.innerText = p3.innerText = p5.innerText = "--%";
                return;
            }
            
            status.className = N < 100 ? "status-bar status-yellow" : "status-bar status-green";
            status.innerText = N < 100 ? `COLLECTING: ${N}/100` : `STRIKER READY: ${N} ROUNDS`;

            const sample = hist.slice(0, 100);
            const theoretical = { "2x": 0.495, "3x": 0.33, "5x": 0.198 };
            
            const calculate = (targetVal, theory) => {
                const empirical = sample.filter(e => e.val >= targetVal).length / sample.length;
                let dynamic = theory + ((theory - empirical) * 1.2);
                return (Math.max(0.05, Math.min(0.95, dynamic)) * 100).toFixed(1) + "%";
            };

            p2.innerText = calculate(2.0, theoretical["2x"]);
            p3.innerText = calculate(3.0, theoretical["3x"]);
            p5.innerText = calculate(5.0, theoretical["5x"]);
        });
    };

    chrome.runtime.onMessage.addListener((msg) => { if (msg.type === "NEW_ENTRY") updateUI(); });

    btnReset.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: "RESET_DATA" }, () => {
            tableBody.innerHTML = "";
            p2.innerText = p3.innerText = p5.innerText = "--%";
            status.className = "status-bar status-red";
            status.innerText = "WARM UP: 0/30";
        });
    });

    updateUI();
});