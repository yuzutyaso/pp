const { exec } = require('child_process');

// 実行を許可するコマンドのホワイトリストを定義
const allowedCommands = ['ls', 'echo', 'whoami'];

module.exports = (req, res) => {
    // VercelはデフォルトでJSONリクエストをパースしないため、手動でパースします
    const body = req.body;
    const userInput = body.command;

    if (!userInput) {
        return res.status(400).json({ error: 'コマンドが指定されていません。' });
    }

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
        
        res.status(200).json({ result: stdout });
    });
};
