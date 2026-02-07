let handler = async (m, {
    conn
}) => {
    conn.bomb = conn.bomb || {};
    let id = m.chat,
        timeout = 180000;
    if (id in conn.bomb) return conn.reply(m.chat, '*⚠️ sesi ini belum selesai*', conn.bomb[id][0]);
    const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5);
    const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const array = bom.map((v, i) => ({
        emot: v,
        number: number[i],
        position: i + 1,
        state: false
    })); // Perbaikan: Menutup kurung kurawal dan kurung biasa yang benar

    let teks = `乂  *B O M B*\n\n💬 Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
    for (let i = 0; i < array.length; i += 3) teks += array.slice(i, i + 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
    teks += `\n⏳ Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n💬 Ketik *nyerah* Untuk Menyerah\n⚠️ *Balas/ REPLY soal ini untuk menjawab*\nℹ️ Apabila mendapat kotak yang berisi bom maka point akan di kurangi.`;
    let msg = await conn.reply(m.chat, teks, m);
    let {
        key
    } = msg

    let v;
    conn.bomb[id] = [
        msg,
        array,
        setTimeout(() => {
            v = array.find(v => v.emot == '💥');
            if (conn.bomb[id]) {
                let buttons = [{
                    buttonId: '.tebakbom',
                    buttonText: {
                        displayText: 'Main Lagi 🔄'
                    },
                    type: 1
                }]
                let buttonMessage = {
                    text: `🚩 *Waktu habis❗*, Bom berada di kotak nomor ${v.number}.`,
                    footer: 'Klik tombol dibawah untuk bermain lagi!',
                    buttons: buttons,
                    headerType: 1
                }
                conn.sendMessage(m.chat, buttonMessage, {
                    quoted: conn.bomb[id][0]
                })
            }
            delete conn.bomb[id];
        }, timeout),
        key
    ];

};

handler.help = ["tebakbom"];
handler.tags = ["game"];
handler.command = /^(bomb|tebakbom)$/i;

export default handler;