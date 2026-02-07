import fetch from 'node-fetch';

let sessions = {};

const gemini = {
    getNewCookie: async () => {
        let r = await fetch("https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c", {
            headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body: "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
            method: "POST"
        });
        let ck = r.headers.get("set-cookie");
        if (!ck) throw Error("cookie kosong");
        return ck.split(";")[0];
    },

    ask: async (p, prev = null) => {
        if (!p?.trim()) throw Error("mana prompt nya?");
        let r = null, c = null;
        if (prev) {
            let j = JSON.parse(atob(prev));
            r = j.newResumeArray, c = j.cookie;
        }
        let h = { "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "x-goog-ext-525001261-jspb": "[1,null,null,null,\"9ec249fc9ad08861\",null,null,null,[4]]", cookie: c || await gemini.getNewCookie() };
        let b = [[p], ["en-US"], r], a = [null, JSON.stringify(b)];
        let body = new URLSearchParams({ "f.req": JSON.stringify(a) });
        let x = await fetch("https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c", { headers: h, body, method: "post" });
        if (!x.ok) throw Error(`${x.status} ${x.statusText} ${await x.text() || "(body response kosong)"}`);
        let d = await x.text(), m = Array.from(d.matchAll(/^\d+\n(.+?)\n/gm)).reverse()[3][1], p1 = JSON.parse(JSON.parse(m)[0][2]);
        return { text: p1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, "*$1*"), id: btoa(JSON.stringify({ newResumeArray: [...p1[1], p1[4][0][0]], cookie: h.cookie })) };
    }
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) return m.reply(`*Contoh:* ${usedPrefix + command} Apa Itu JavaScript`);
        
        // Menampilkan pesan "Sedang memproses..."
        await m.reply("Sedang memproses, mohon tunggu...");

        let s = sessions[m.sender], p = s && s.expire > Date.now() ? s.id : null;
        let r = await gemini.ask(args.join(" "), p);
        sessions[m.sender] = { id: r.id, expire: Date.now() + 86400000 };

        // Mengirim balasan dengan tampilan yang disesuaikan
        await conn.sendMessage(m.chat, {
            text: r.text,
            contextInfo: {
                externalAdReply: {
                    title: '🚀 G E M I N I  A I',
                    body: `${global.namebot} || ${global.author}`,
                    thumbnailUrl: 'https://files.cloudkuimages.guru/images/Q1qjvJdB.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

    } catch (e) {
        m.reply(e.message);
    }
};

handler.help = ['gemini <teks>'];
handler.command = ['gemini'];
handler.tags = ['ai'];

export default handler;