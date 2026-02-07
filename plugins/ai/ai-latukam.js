import axios from 'axios';

async function fetchContent(content, sender) {
    try {
        const response = await axios.post('https://luminai.my.id/', {
            content,
            user: sender,
            cName: "latukam",
            cID: "latukam",
            prompt: 'Namamu adalah Latukam, ...' // Your full prompt remains the same
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Terjadi kesalahan saat memproses permintaan Anda.');
    }
}

let handler = async (m, { conn, text }) => {
    const userID = m.sender;  // Use sender ID to track individual conversations
    conn.latukam = conn.latukam || {};

    if (!text) throw `*• Contoh:* .latukam *[on/off]*`;

    if (text === "on") {
        if (conn.latukam[userID]) {
            clearTimeout(conn.latukam[userID].timeout);
        }
        conn.latukam[userID] = { user: userID, pesan: [], timeout: setTimeout(() => delete conn.latukam[userID], 3600000) }; // 1-hour timeout
        m.reply("[ ✓ ] Sesi AI dimulai.");
    } else if (text === "off") {
        if (conn.latukam[userID]) {
            clearTimeout(conn.latukam[userID].timeout);
            delete conn.latukam[userID];
            m.reply("[ ✓ ] Sesi AI diakhiri.");
        } else {
            m.reply("[ ✓ ] Tidak ada sesi AI aktif.");
        }
    }
};

handler.before = async (m, { conn }) => {
    const userID = m.sender;
    conn.latukam = conn.latukam || {};
    if (m.isBaileys || !m.text || !conn.latukam[userID]) return;
    if (/^[.\#!\/\\]/.test(m.text)) return;
    if (m.sender !== conn.latukam[userID].user) return;

    await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

    try {
        const result = await fetchContent(m.text, m.sender);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        m.reply(result.result.replace(/\*\*/g, '*')); // Replace '**' with '*' in the response text
        conn.latukam[userID].pesan.push(m.text); // Store the user's message in their conversation history
    } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(error.message);
    }
};

handler.command = ['latukam'];
handler.tags = ['ai'];
handler.help = ['latukam *[on/off]*'];
handler.register = true;
handler.limit = true;

export default handler;