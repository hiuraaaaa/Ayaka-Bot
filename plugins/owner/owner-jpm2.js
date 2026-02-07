let handler = async (m, { conn, text }) => {
    if (!text || !text.includes('>')) {
        return conn.reply(m.chat, 'Format salah!\n\nContoh penggunaan:\n*.jpm2 Halo semuanya!>2000*\n\nGunakan tanda `>` untuk memisahkan pesan dan jeda antar grup dalam milidetik.', m);
    }

    try {
        let [pesan, jeda] = text.split('>');
        jeda = parseInt(jeda.trim());
        if (isNaN(jeda) || jeda < 1000) {
            return conn.reply(m.chat, 'Durasi jeda harus berupa angka minimal 1000 (1 detik).', m);
        }

        let getGroups = await conn.groupFetchAllParticipating();
        let groups = Object.values(getGroups);
        let total = groups.length;

        conn.reply(m.chat, `*BROADCAST STARTED*\n\nTotal Grup: ${total}\nEstimasi Selesai: ~${(total * jeda / 1000).toFixed(1)} detik`, m);

        for (let group of groups) {
            await conn.delay(jeda);
            let metadata = await conn.groupMetadata(group.id);
            let participants = metadata.participants || [];

            await conn.sendMessage(group.id, {
                text: pesan.trim(),
                mentions: participants.map(p => p.id)
            });
        }

        conn.reply(m.chat, '*Broadcast selesai dikirim ke semua grup.*', m);
    } catch (err) {
        console.error(err);
        conn.reply(m.chat, 'Terjadi kesalahan saat mengirim broadcast.', m);
    }
}

handler.help = ['jpm2 <pesan>><delay_ms>'];
handler.tags = ['owner'];
handler.command = /^jpm2$/i;
handler.owner = true;

export default handler;