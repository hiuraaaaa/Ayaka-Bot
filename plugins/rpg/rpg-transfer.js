const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `transfer ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, args, usedPrefix, DevMode }) => {
    if (args.length < 3) {
        return conn.reply(m.chat, `Contoh: *${usedPrefix}transfer Money 100 @tag*\n\n*List Yang Bisa Di Transfer :*\n• Money\n• Tabungan\n• Potion\n• trash\n• Diamond\n• Common\n• Uncommon\n• Mythic\n• Legendary\n• String\n• wood\n• rock\n• Iron`.trim(), fkontak); // Menggunakan fkontak
    } else try {
        let type = (args[0] || '').toLowerCase();
        let count = args[1] && args[1].length > 0 ? Math.min(99999999999999999999999, Math.max(parseInt(args[1]), 1)) : Math.min(1);
        let who = m.mentionedJid ? m.mentionedJid[0] : (args[2].replace(/[@ .+-]/g, '').replace(' ', '') + '@s.whatsapp.net');
        if (!m.mentionedJid || !args[2]) return conn.reply(m.chat, 'Tag Salah Satu, Atau Ketik Nomernya!!', fkontak); // Menggunakan fkontak
        let users = global.db.data.users;

        // Pastikan target ada di database
        if (!users[who]) {
            return conn.reply(m.chat, `Pengguna yang ditag tidak ditemukan dalam database bot.`, fkontak);
        }

        switch (type) {
            case 'money':
                if (global.db.data.users[m.sender].money >= count * 1) { // PERUBAHAN: eris diubah menjadi money
                    try {
                        global.db.data.users[m.sender].money -= count * 1; // PERUBAHAN: eris diubah menjadi money
                        global.db.data.users[who].money += count * 1; // PERUBAHAN: eris diubah menjadi money
                        conn.reply(m.chat, `Berhasil Mentransfer Money Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].money += count * 1; // PERUBAHAN: eris diubah menjadi money
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Money Kamu Tidak Mencukupi Untuk Mentransfer Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'tabungan': // asumsikan 'tabungan' merujuk ke 'bank'
                if (global.db.data.users[m.sender].bank >= count * 1) {
                    try {
                        global.db.data.users[m.sender].bank -= count * 1;
                        global.db.data.users[who].bank += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer Uang Dari Bank Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].bank += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Tidak Mencukupi Untuk mentransfer Uang Dari Bank Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'limit':
                if (global.db.data.users[m.sender].limit >= count * 1) {
                    try {
                        global.db.data.users[m.sender].limit -= count * 1;
                        global.db.data.users[who].limit += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer Limit Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].limit += count * 1; // Perbaikan: dari [m.sender].limit
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Limit Kamu Tidak Mencukupi Untuk Mentransfer Sebesar ${count} Limit`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'potion':
                if (global.db.data.users[m.sender].potion >= count * 1) {
                    try {
                        global.db.data.users[m.sender].potion -= count * 1;
                        global.db.data.users[who].potion += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} Potion`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].potion += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Potion Kamu Tidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'trash':
                if (global.db.data.users[m.sender].trash >= count * 1) {
                    try {
                        global.db.data.users[m.sender].trash -= count * 1;
                        global.db.data.users[who].trash += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} trash`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].trash += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `trash Kamu Tidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'diamond':
                if (global.db.data.users[m.sender].diamond >= count * 1) {
                    try {
                        global.db.data.users[m.sender].diamond -= count * 1;
                        global.db.data.users[who].diamond += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} Diamond`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].diamond += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Diamond Kamu Tidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'common':
                if (global.db.data.users[m.sender].common >= count * 1) {
                    try {
                        global.db.data.users[m.sender].common -= count * 1;
                        global.db.data.users[who].common += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} Common Crate`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].common += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Common Crate Kamu Tidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'uncommon':
                if (global.db.data.users[m.sender].uncommon >= count * 1) {
                    try {
                        global.db.data.users[m.sender].uncommon -= count * 1;
                        global.db.data.users[who].uncommon += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} Uncommon Crate`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].uncommon += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Uncommon Crate Kamu Tidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'mythic':
                if (global.db.data.users[m.sender].mythic >= count * 1) {
                    try {
                        global.db.data.users[m.sender].mythic -= count * 1;
                        global.db.data.users[who].mythic += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} Mythic Crate`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].mythic += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Mythic Crate Kamu Tidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'legendary':
                if (global.db.data.users[m.sender].legendary >= count * 1) {
                    try {
                        global.db.data.users[m.sender].legendary -= count * 1;
                        global.db.data.users[who].legendary += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer ${count} Legendary Crate`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].legendary += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Legendary Crate Kamu Tiidak Cukup`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'string':
                if (global.db.data.users[m.sender].string >= count * 1) {
                    try {
                        global.db.data.users[m.sender].string -= count * 1;
                        global.db.data.users[who].string += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer String Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].string += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `String Kamu Tidak Mencukupi Untuk Mentransfer String Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'rock':
                if (global.db.data.users[m.sender].rock >= count * 1) {
                    try {
                        global.db.data.users[m.sender].rock -= count * 1;
                        global.db.data.users[who].rock += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer rock Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].rock += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `rock Kamu Tidak Mencukupi Untuk Mentransfer rock Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'wood':
                if (global.db.data.users[m.sender].wood >= count * 1) {
                    try {
                        global.db.data.users[m.sender].wood -= count * 1;
                        global.db.data.users[who].wood += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer wood Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].wood += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `wood Kamu Tidak Mencukupi Untuk Mentransfer wood Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                break;
            case 'iron':
                if (global.db.data.users[m.sender].iron >= count * 1) {
                    try {
                        global.db.data.users[m.sender].iron -= count * 1;
                        global.db.data.users[who].iron += count * 1;
                        conn.reply(m.chat, `Berhasil Mentransfer Iron Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                    } catch (e) {
                        global.db.data.users[m.sender].iron += count * 1;
                        conn.reply(m.chat, 'Gagal Menstransfer', fkontak); // Menggunakan fkontak
                        console.log(e);
                        if (DevMode) {
                            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
                            }
                        }
                    }
                } else conn.reply(m.chat, `Iron Kamu Tidak Mencukupi Untuk Mentransfer Iron Sebesar ${count}`.trim(), fkontak); // Menggunakan fkontak
                break;
            default:
                return conn.reply(m.chat, `Contoh: *${usedPrefix}transfer money 100 @tag*\n\n*List Yang Bisa Di Transfer :*\n•》Money\n• Tabungan\n• Potion\n• trash\n• Diamond\n• Common\n• Uncommon\n• Mythic\n• Legendary\n• String\n• wood\n• rock\n• Iron`.trim(), fkontak); // Menggunakan fkontak
        }
    } catch (e) {
        conn.reply(m.chat, `Contoh: *${usedPrefix}transfer money 100 @tag*\n\n*List Yang Bisa Di Transfer :*\n•》Money\n• Tabungan\n• Potion\n• trash\n• Diamond\n• Common\n• Uncommon\n• Mythic\n• Legendary\n• String\n• wood\n• rock\n• Iron`.trim(), fkontak); // Menggunakan fkontak
        console.log(e);
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, 'Transfer.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m);
            }
        }
    }
}

handler.help = ['transfer'];
handler.tags = ['rpg'];
handler.command = /^(transfer|tf)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.register = true;
handler.group = true;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.money = 0; // Ini adalah properti handler, bukan user.money

export default handler;