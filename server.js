const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public')); // publicディレクトリの静的ファイルを公開
app.use(express.json());

// 実行を許可するコマンドのホワイトリストを定義
const allowedCommands = ['ls', 'echo', 'whoami'];

app.post('/execute', (req, res) => {
    const userInput = req.body.command;
    const parts = userInput.trim().split(' ');
    const command = parts[0];
    
    // ホワイトリストにコマンドが含まれているかチェック
    if (!allowedCommands.includes(command)) {
        return res.status(403).json({ error: `許可されていないコマンドです: ${command}` });
    }

    // コマンドを実行
    exec(userInput, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `コマンドの実行中にエラーが発生しました: ${stderr}` });
        }
        
        res.json({ result: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
