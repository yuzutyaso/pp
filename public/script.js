document.addEventListener('DOMContentLoaded', () => {
    const commandInput = document.getElementById('command-input');
    const outputDiv = document.getElementById('output');
    const executeBtn = document.getElementById('execute-btn');

    const executeCommand = async () => {
        const command = commandInput.value.trim();
        if (!command) return;

        // コマンドを画面に表示
        outputDiv.innerHTML += `<div class="input-line"><span class="prompt">$&nbsp;</span>${command}</div>`;
        commandInput.value = '';

        // コマンドをスペースで分割して、最初の部分（コマンド名）を取得
        const parts = command.split(' ');
        const baseCommand = parts[0];

        try {
            let response;
            // pingコマンドが入力された場合は、専用のサーバーレス関数にリクエストを送信
            if (baseCommand === 'ping') {
                const host = parts[1];
                if (!host) {
                    throw new Error('ping: ホスト名が指定されていません。');
                }
                response = await fetch('/api/ping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ host: host })
                });
            } else {
                // その他のコマンドは、従来のサーバーレス関数にリクエストを送信
                response = await fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: command })
                });
            }

            const data = await response.json();
            
            // 結果を画面に表示
            if (response.ok) {
                outputDiv.innerHTML += `<div class="result-line">${data.result}</div>`;
            } else {
                outputDiv.innerHTML += `<div class="error-line">Error: ${data.error}</div>`;
            }

        } catch (error) {
            outputDiv.innerHTML += `<div class="error-line">通信エラーが発生しました: ${error.message}</div>`;
        }

        // スクロールを一番下へ
        outputDiv.scrollTop = outputDiv.scrollHeight;
    };

    executeBtn.addEventListener('click', executeCommand);
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand();
        }
    });
});
