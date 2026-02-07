const handler = async (m, { conn, args, usedPrefix, command }) => {
    global.db.data.users = global.db.data.users || {};
    let user = global.db.data.users[m.sender] || {};

    if (!args[0]) {
        return conn.reply(m.chat, `Mulai atur profilmu sekarang❗
Ikuti langkah-langkah di bawah ini

📌 Pertama, atur nama kamu dengan perintah:
*.setnama [nama_baru]*


Kamu bisa set Manual beberapa Data Kamu yang lain,antara lain
*.editprofile channel* <link channel>
*.editprofile facebook* <link facebook>
*.editprofile instagram* <username instagram>
*.editprofile tiktok* <username tiktok>
*.editprofile pernikahan* <status pernikahan>
*.editprofile pacar* <nama pacar>
*.editprofile sahabat* <nama sahabat>`, m);
    }

    let [key, ...rest] = args;
    key = key.toLowerCase();
    let value = rest.join(" ");

    const validKeys = [
        "nama", "umur", "ttl", "jk", "agama", "hobi", "kota", "negara",
        "pacar", "sahabat", "channel", "facebook", "instagram", "tiktok", "pernikahan"
    ];

    if (!validKeys.includes(key)) {
        return conn.reply(m.chat, `❌ Kolom tidak dikenali!\n\nKolom yang bisa diubah:\n${validKeys.map(k => `• ${k}`).join('\n')}`, m);
    }

    user[key] = value;

    if (key === "umur") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *umur* menjadi: ${value}`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.jk',
                    buttonText: { displayText: 'Lanjut ke jenis kelamin' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    if (key === "jk") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *jenis kelamin* menjadi: ${value}`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.hobi',
                    buttonText: { displayText: 'Lanjut ke hobi' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    if (key === "hobi") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *hobi* menjadi: ${value}`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.negara',
                    buttonText: { displayText: 'Lanjut ke negara' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    if (key === "negara") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *negara* menjadi: ${value}`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.kota',
                    buttonText: { displayText: 'Lanjut ke kota' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    if (key === "kota") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *kota* menjadi: ${value}`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.agama',
                    buttonText: { displayText: 'Lanjut ke agama' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    if (key === "agama") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *agama* menjadi: ${value}`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.pilihtanggal',
                    buttonText: { displayText: 'Step akhir set TTL' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    if (key === "ttl") {
        return conn.reply(m.chat, `✅ Berhasil mengubah *tanggal lahir* menjadi: ${value}\nketik .me untuk melihat perubahan`, m, {
            contextInfo: { mentionedJid: [] },
            buttons: [
                {
                    buttonId: '.me',
                    buttonText: { displayText: 'Lihat Profile Kamu' },
                    type: 1
                }
            ],
            type: 1
        });
    }

    return conn.reply(m.chat, `✅ Berhasil mengubah *${key}* menjadi: ${value}`, m);
};

handler.command = ["editprofile"];
handler.help = ["editprofile [kolom] [isi]"];
handler.tags = ["main"];

export default handler;