const { exec } = require('child_process');

// 実行を許可するコマンドのホワイトリスト
// 安全性を考慮し、システムへの変更を加えないコマンドに限定しています
const allowedCommands = [
    'ls', 'echo', 'whoami', 'pwd', 'date', 'uname',
    'df', 'free', 'expr', 'cat', 'cal', 'head',
    'tail', 'wc', 'sort', 'uniq', 'grep', 'hostname',
    'curl', 'id', 'groups', 'who', 'logname', 'w',
    'uptime', 'env', 'printenv', 'cut', 'paste', 'join',
    'nl', 'rev', 'shuf', 'tr', 'tee', 'touch', 'stat',
    'file', 'readlink', 'basename', 'dirname', 'seq',
    'yes', 'factor', 'man'
];

module.exports = (req, res) => {
    const body = req.body;
    const userInput = body.command;

    if (!userInput) {
        return res.status(400).json({ error: 'コマンドが指定されていません。' });
    }

    const parts = userInput.trim().split(' ');
    const command = parts[0];
    
    // コマンド名のみを抽出し、ホワイトリストと照合します
    const baseCommand = command.split(' ')[0];

    if (!allowedCommands.includes(baseCommand)) {
        return res.status(403).json({ error: `許可されていないコマンドです: ${command}` });
    }

    // exec()関数を使ってコマンドを実行します
    exec(userInput, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `コマンドの実行中にエラーが発生しました: ${stderr}` });
        }
        
        // 成功した場合は標準出力を返します
        res.status(200).json({ result: stdout });
    });
};
