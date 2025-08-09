document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('command-input');
    const outputDiv = document.getElementById('output');
    const executeBtn = document.getElementById('execute-btn');

    const executeCommand = async () => {
        const command = commandInput.value.trim();
        if (!command) return;

        outputDiv.innerHTML += `<div class="input-line"><span class="prompt">$&nbsp;</span>${command}</div>`;
        commandInput.value = '';

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command: command })
            });

            const data = await response.json();
            
            if (response.ok) {
                outputDiv.innerHTML += `<div class="result-line">${data.result}</div>`;
            } else {
                outputDiv.innerHTML += `<div class="error-line">Error: ${data.error}</div>`;
            }

        } catch (error) {
            outputDiv.innerHTML += `<div class="error-line">通信エラーが発生しました: ${error.message}</div>`;
        }

        outputDiv.scrollTop = outputDiv.scrollHeight;
    };

    executeBtn.addEventListener('click', executeCommand);
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand();
        }
    });
});
