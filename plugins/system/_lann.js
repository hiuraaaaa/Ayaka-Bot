let handler = async (m, { conn }) => {
    await conn.sendMessage(
        m.chat,
        {
            video: { url: 'https://c.termai.cc/a57/0uRr.mp4' },
            mimetype: 'video/mp4',
            ptv: true
        },
        { quoted: m }
    );
};

handler.customPrefix = /^Rijalganzz$/i;  // trigger PERSIS "lann"
handler.command = new RegExp;        // wajib ada supaya tidak error loader

export default handler;