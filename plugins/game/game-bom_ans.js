export async function before(m) {
    try {
        let id = m.chat;
        let timeout = 180000;
        let reward = randomInt(100, 80000);
        let users = global.db.data.users[m.sender];
        let body = typeof m.text == 'string' ? m.text : false;
        this.bomb = this.bomb ? this.bomb : {};

        if (!this.bomb[id]) return !1

        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);

        if (isSurrender) {
            const buttons = [
                { buttonId: '.tebakbom', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
            ]
            const buttonMessage = {
                text: '☹️ *Yah Menyerah❗*',  // Caption diletakkan di text
                footer: 'Klik tombol dibawah untuk bermain lagi!', // Footer diletakkan di footer
                buttons: buttons,
                headerType: 4,
            }
            await this.sendMessage(m.chat, buttonMessage, { quoted: m })
            clearTimeout(this.bomb[id][2]);
            delete this.bomb[id];
            return !0;
        }

        if (this.bomb[id] && m.quoted && m.quoted.id == this.bomb[id][0].key.id && !isNaN(body)) {
            let json = this.bomb[id][1].find(v => v.position == body);
            if (!json) return this.reply(m.chat, `🚩 Untuk membuka kotak kirim angka 1 - 9`, m);

            if (json.emot == '💥') {
                json.state = true;
                let bomb = this.bomb[id][1];
                let teks = `乂  *B O M B*\n\n`;
                teks += `💬 Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
                teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
                teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
                teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
                teks += `*🚫 Permainan selesai, kotak berisi bom terbuka*\n`;
                teks += `⛓️ Sanksi: *➖${formatNumber(reward)} ✨XP*`;

                const buttons = [
                    { buttonId: '.tebakbom', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                ]

                const buttonMessage = {
                    text: teks,
                    footer: 'Klik tombol dibawah untuk bermain lagi!',
                    buttons: buttons,
                    headerType: 4,
                }

                await this.sendMessage(m.chat, buttonMessage, { quoted: this.bomb[id][0] }).then(() => {
                    users.exp < reward ? users.exp = 0 : users.exp -= reward;
                    clearTimeout(this.bomb[id][2]);
                    delete this.bomb[id];
                });
            } else if (json.state) {
                return this.reply(m.chat, `🚩 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, m);
            } else {
                json.state = true;
                let changes = this.bomb[id][1];
                let open = changes.filter(v => v.state && v.emot != '💥').length;

                if (open >= 8) {
                    let teks = `乂  *B O M B*\n\n`;
                    teks += `💬 Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
                    teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
                    teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
                    teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
                    teks += `*🎉Permainan selesai, kotak berisi bom tidak terbuka🎉*\n`;
                    teks += `🎁 Hadiah: *${formatNumber(reward)} ✨XP*`;
                      const buttons = [
                        { buttonId: '.tebakbom', buttonText: { displayText: 'Main Lagi 🔄' }, type: 1 }
                    ]

                    const buttonMessage = {
                        text: teks,
                        footer: 'Klik tombol dibawah untuk bermain lagi!',
                        buttons: buttons,
                        headerType: 4,
                    }


                    await this.sendMessage(m.chat, buttonMessage, { quoted: this.bomb[id][0] }).then(() => {
                        users.exp += reward;
                        clearTimeout(this.bomb[id][2]);
                        delete this.bomb[id];
                    });
                } else {
                    let teks = `乂  *B O M B*\n\n`;
                    teks += `💬 Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
                    teks += changes.slice(0, 3).map(v => v.state ? (v.emot === '✅' ? '✅' : v.emot) : v.number).join('') + '\n';
                    teks += changes.slice(3, 6).map(v => v.state ? (v.emot === '✅' ? '✅' : v.emot) : v.number).join('') + '\n';
                    teks += changes.slice(6).map(v => v.state ? (v.emot === '✅' ? '✅' : v.emot) : v.number).join('') + '\n\n';
                    teks += `⏳ Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`;
                    teks += `*🔒Kotak berisi bom tidak terbuka*\n`;
                    teks += `💬 Ketik *nyerah* Untuk Menyerah\n`;
                    teks += `⚠️ *Balas/ REPLY soal ini untuk menjawab*\n`;
                    teks += `*➕${formatNumber(reward)} ✨XP*`;

                   await this.sendMessage(m.chat, {text: teks, edit: this.bomb[id][0].key});
                    users.exp += reward;
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
    return !0;
}

export const exp = 0;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(number) {
    return number.toLocaleString();
}