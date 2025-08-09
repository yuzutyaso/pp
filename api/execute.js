const { exec } = require('child_process');

// 実行を禁止するコマンドのブラックリストを定義
const blockedCommands = [
    'rm', 'sh', 'bash', 'nc', 'wget', 'reboot', 'shutdown',
    'sudo', 'su'
];

module.exports = (req, res) => {
    const body = req.body;
    const userInput = body.command;

    if (!userInput) {
        return res.status(400).json({ error: 'コマンドが指定されていません。' });
    }

    const parts = userInput.trim().split(' ');
    const command = parts[0];
    const baseCommand = command.split(' ')[0];

    // ブラックリストにコマンドが含まれていないかチェック
    // ⚠️ このチェックだけでは不十分です
    if (blockedCommands.includes(baseCommand)) {
        return res.status(403).json({ error: `このコマンドは禁止されています: ${command}` });
    }
    
    // exec(userInput) は引き続き脆弱性を持っています
    exec(userInput, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `コマンドの実行中にエラーが発生しました: ${stderr}` });
        }
        
        res.status(200).json({ result: stdout });
    });
};
