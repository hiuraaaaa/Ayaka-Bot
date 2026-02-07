const timeout = 1800000;

let handler = async (m, { conn, usedPrefix, text }) => {
    let user = global.db.data.users[m.sender];
    let apel = user.bibitapel;
    let anggur = user.bibitanggur;
    let mangga = user.bibitmangga;
    let pisang = user.bibitpisang;
    let jeruk = user.bibitjeruk;
    let time = user.lastberkebon + timeout;

    if (apel == 0 || anggur == 0 || mangga == 0 || pisang == 0 || jeruk == 0) {
        return conn.reply(m.chat, `*Pastikan Kamu Memiliki Semua Bibit*\n*Bibit Yang Kamu Miliki\n🍎 Bibit Apel ${apel}\n🥭Bibit Mangga ${mangga}\n🍊 Bibit Jeruk ${jeruk}\n🍌 Bibit Pisang ${pisang}\n🍇 Bibit Anggur ${anggur}*\n\nKetik :\n${usedPrefix}shop buy bibitmangga 500\n\n*List*\nbibitmangga\nbibitanggur\nbibitpisang\nbibitjeruk\nbibitapel`, m);
    }

    if (new Date - user.lastberkebon < timeout) {
        throw `Anda sudah menanam\nMohon tunggu hasil panenmu\nTunggu selama ${msToTime(time - new Date())} lagi`;
    }

    if (apel > 499) {
        if (pisang > 499) {
            if (jeruk > 499) {
                if (mangga > 499) {
                    if (anggur > 499) {
                        let pisangPoin = Math.floor(Math.random() * 500);
                        let anggurPoin = Math.floor(Math.random() * 500);
                        let manggaPoin = Math.floor(Math.random() * 500);
                        let jerukPoin = Math.floor(Math.random() * 500);
                        let apelPoin = Math.floor(Math.random() * 500);
                        user.pisang += pisangPoin;
                        user.anggur += anggurPoin;
                        user.mangga += manggaPoin;
                        user.jeruk += jerukPoin;
                        user.apel += apelPoin;
                        user.tiketcoin++;
                        user.bibitpisang -= 500;
                        user.bibitanggur -= 500;
                        user.bibitmangga -= 500;
                        user.bibitjeruk -= 500;
                        user.bibitapel -= 500;
                        user.lastberkebon = Date.now();
                        let hsl = `Selamat ${conn.getName(m.sender)}, Kamu mendapatkan : \n🍌 *Pisang :* +${pisangPoin}\n🥭 *Mangga :* +${manggaPoin}\n🍇 *Anggur :* +${anggurPoin}\n🍊 *Jeruk :* +${jerukPoin}\n🍎 *Apel :* +${apelPoin}`;
                        conn.reply(m.chat, hsl, flok);
                        setTimeout(() => {
                        let mentionedJid = [m.sender]
                            conn.reply(m.chat, `@${m.sender.replace(/@.+/, '')}, Waktunya Berkebun Lagi Kak`, flok, {contextInfo: { mentionedJid }});
                        }, timeout);
                    } else m.reply(`Bibit 🍇anggur yang kamu Miliki ${anggur}`);
                } else m.reply(`Bibit 🥭mangga yang kamu Miliki ${mangga}`);
            } else m.reply(`Bibit 🍊jeruk yang kamu Miliki ${jeruk}`);
        } else m.reply(`Bibit 🍌pisang yang kamu Miliki ${pisang}`);
    } else m.reply(`Bibit 🍎apel yang kamu Miliki ${apel}`);
}

handler.help = ['berkebun'];
handler.tags = ['rpg'];
handler.command = /^(berkebun)/i;
handler.group = true;
handler.limit = true;

export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + " Jam " + minutes + " Menit " + seconds + " Detik";
}