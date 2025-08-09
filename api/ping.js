const ping = require('ping');

module.exports = async (req, res) => {
    const body = req.body;
    const host = body.host;

    if (!host) {
        return res.status(400).json({ error: 'ホスト名が指定されていません。' });
    }

    try {
        const result = await ping.promise.probe(host);
        if (result.alive) {
            res.status(200).json({ result: `ホスト ${host} からの応答: 成功\nIPアドレス: ${result.numeric_host}\n応答時間: ${result.time}ms` });
        } else {
            res.status(200).json({ result: `ホスト ${host} からの応答: 失敗` });
        }
    } catch (error) {
        res.status(500).json({ error: `pingの実行中にエラーが発生しました: ${error.message}` });
    }
};
