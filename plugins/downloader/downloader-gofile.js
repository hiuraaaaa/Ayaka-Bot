import axios from 'axios';

const handler = async (m, { conn, text }) => {
    if (text.match(/(https:\/\/gofile.io\/d\/)/gi)) {
        let res = await goFileDl(text);
        if (!res || !res.data) return conn.reply(m.chat, 'Unable to Download File', m);
        await m.reply(Object.keys(res.data).map(v => `*• ${capitalize(v)}:* ${res.data[v]}`).join('\n') + '\n\n_Sending file..._');
        await conn.sendMessage(m.chat, { document: { url: res.data.link }, fileName: res.data.name, mimetype: res.data.mimetype }, { quoted: m });
    } else {
        return conn.reply(m.chat, '• *Example :* .gofile https://gofile.io/d/TRBoqX', m);
    }
};

handler.help = ['gofile'].map(v => v + ' *<link>*');
handler.tags = ['downloader'];
handler.command = /^(gofile)$/i;
handler.limit = 3;

export default handler;

async function goFileDl(url) {
    const headers = {
        "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/534.26 (KHTML, like Gecko) Chrome/51.0.2561.232 Mobile Safari/536.0',
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "*/*",
        "Connection": "keep-alive"
    };

    try {
        const { data: { data: { token } } } = await axios.post("https://api.gofile.io/accounts", {}, { headers });
        const contentId = url.match(/\/d\/([^\/]*)/)[1];
        const { data: { data: { children, childrenIds } } } = await axios.get(
            `https://api.gofile.io/contents/${contentId}?wt=4fd6sg89d7s6&cache=true`,
            { headers: { ...headers, Authorization: `Bearer ${token}` } }
        );

        const fileID = childrenIds[0];
        const fileData = children[fileID];

        const relevantKeys = ['name', 'type', 'createTime', 'size', 'downloadCount', 'mimetype', 'servers', 'link'];
        const data = Object.fromEntries(relevantKeys.map(key => [key, fileData[key]]));

        return {
            author: 'shannz',
            auth: token,
            data
        };
    } catch (e) {
        return { status: false, error: e };
    }
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);