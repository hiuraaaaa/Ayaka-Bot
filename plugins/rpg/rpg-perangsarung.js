let handler = async (m, { conn, text, participants }) => {
    let taggedUsers = [...new Set([m.sender, ...m.mentionedJid])];
    if (taggedUsers.length < 5) {
        return conn.reply(m.chat, `Minimal *5 orang* untuk bermain Perang Sarung!`, m);
    }

    let betAmount = parseInt(text.split(' ')[0]);
    if (isNaN(betAmount) || betAmount <= 0) {
        return conn.reply(m.chat, `Masukkan nominal taruhan yang valid! Contoh: *.perangsarung 50000 @tag*`, m);
    }

    let players = taggedUsers.map(jid => ({
        jid,
        name: conn.getName(jid),
        money: global.db.data.users[jid]?.money || 0
    }));

    for (let player of players) {
        if (player.money < betAmount) {
            return conn.reply(m.chat, `@${player.jid.split('@')[0]} tidak memiliki cukup money untuk bertaruh!`, m, { mentions: [player.jid] });
        }
    }

    for (let player of players) {
        global.db.data.users[player.jid].money -= betAmount;
    }

    function randomEliminate() {
        if (players.length <= 3) return null;
        let index = Math.floor(Math.random() * players.length);
        return players.splice(index, 1)[0];
    }

    let gameText = `⚔️ *Game Perang Sarung Dimulai!* ⚔️\n💰 *Taruhan:* ${betAmount} money per pemain\n\nPeserta:\n${players.map(p => `- @${p.jid.split('@')[0]}`).join('\n')}`;
    conn.reply(m.chat, gameText, m, { mentions: taggedUsers });

    let totalRonde = players.length - 3;
    for (let i = 0; i < totalRonde; i++) {
        setTimeout(() => {
            let eliminated = randomEliminate();
            if (eliminated) {
                conn.reply(m.chat, `🔥 *Ronde ${i + 1}*: @${eliminated.jid.split('@')[0]} telah tumbang! ☠️`, m, { mentions: [eliminated.jid] });
            }
        }, (i + 1) * 5000);
    }

    setTimeout(() => {
        if (players.length < 3) {
            return conn.reply(m.chat, `⚠️ Terjadi kesalahan, jumlah pemain kurang untuk menentukan juara!`, m);
        }

        let juara3 = players.splice(Math.floor(Math.random() * players.length), 1)[0];
        conn.reply(m.chat, `🥉 *Juara 3:* @${juara3.jid.split('@')[0]} telah tumbang! ☠️`, m, { mentions: [juara3.jid] });

        setTimeout(() => {
            let juara2 = players.splice(Math.floor(Math.random() * players.length), 1)[0];
            conn.reply(m.chat, `🥈 *Juara 2:* @${juara2.jid.split('@')[0]} telah tumbang! ☠️`, m, { mentions: [juara2.jid] });

            setTimeout(() => {
                let juara1 = players[0];
                let totalPrize = betAmount * taggedUsers.length;
                global.db.data.users[juara1.jid].money += totalPrize;

                let resultText = `🏆 *Hasil Akhir Perang Sarung!* 🏆\n\n` +
                    `🥇 *Juara 1:* @${juara1.jid.split('@')[0]} (+${totalPrize} money)\n` +
                    `🥈 *Juara 2:* @${juara2.jid.split('@')[0]}\n` +
                    `🥉 *Juara 3:* @${juara3.jid.split('@')[0]}\n\nTerima kasih sudah bermain dan yang sudah boleh pulang! ☠️`;

                conn.reply(m.chat, resultText, m, { mentions: [juara1.jid, juara2.jid, juara3.jid] });
            }, 5000);
        }, 5000);
    }, (totalRonde + 1) * 5000);
};

handler.help = ['perangsarung <taruhan> @tag'];
handler.tags = ['rpg'];
handler.command = /^(perangsarung)$/i;
handler.group = true;
handler.register = true;

export default handler;