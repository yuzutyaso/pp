const { exec } = require('child_process');

const allowedCommands = [
    'ls', 'echo', 'whoami', 'pwd', 'date', 'uname',
    'df', 'free', 'expr', 'cat', 'cal', 'head',
    'tail', 'wc', 'sort', 'uniq', 'grep', 'hostname'
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

    if (!allowedCommands.includes(baseCommand)) {
        return res.status(403).json({ error: `許可されていないコマンドです: ${command}` });
    }

    exec(userInput, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: `コマンドの実行中にエラーが発生しました: ${stderr}` });
        }
        
        res.status(200).json({ result: stdout });
    });
};
