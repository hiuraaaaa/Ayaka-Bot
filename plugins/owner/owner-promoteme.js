/*
* Nama Fitur : Promote Owner
* Type : Plugins ESM
* Sumber : https://whatsapp.com/channel/0029Vb6p7345a23vpJBq3a1h
* Channel Testimoni : https://whatsapp.com/channel/0029Vb6B91zEVccCAAsrpV2q
* Group Bot : https://chat.whatsapp.com/CBQiK8LWkAl2W2UWecJ0BG
* Author : 𝐅𝐚𝐫𝐢𝐞l
* Nomor Author : https://wa.me/6288705574039
*/
import fetch from 'node-fetch'
import pkg from '@adiwajshing/baileys'
const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `Promote Owner ⭐` }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let handler = async (m, { conn, usedPrefix, command, text }) => {
  try {
    if (!text) {
        return conn.reply(m.chat, `*❌ Perintah salah!*\n\n*📝 Contoh:*\n> ${usedPrefix + command} ${global.link.gc}\n> ${usedPrefix + command} 120363404563729037@g.us`, m, { quoted: fkontak });
    }
    
    let link = text.trim();
    let code = link.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]{22})/)?.[1];
    let jid = link.match(/(\d{15,})@g\.us/i)?.[0];
    let gid;
    if (code) {
        await conn.reply(m.chat, `🔄 Memproses...\n> Mencoba bergabung ke grup via link...`, m, { quoted: fkontak });
        try {
            gid = await conn.groupAcceptInvite(code);
        } catch (e) {
            console.error(e);
            return conn.reply(m.chat, `❌ Gagal bergabung ke grup via link.\n\nMungkin link sudah kadaluwarsa, grup sudah penuh, atau saya sudah di-kick dari grup itu.`, m, { quoted: fkontak });
        }
        await conn.reply(m.chat, `*✅ Berhasil bergabung ke grup!*`, m, { quoted: fkontak });
    } else if (jid) {
        gid = jid;
        await conn.reply(m.chat, `🔄 Memproses...\n> Menggunakan ID Grup: ${gid}\n> Memverifikasi keanggotaan bot...`, m, { quoted: fkontak });
        try {
            await conn.groupMetadata(gid); // Cek apakah bot ada di grup
        } catch (e) {
            console.error(e);
            return conn.reply(m.chat, `❌ Gagal memverifikasi ID Grup.\n\nPastikan ID grup valid dan bot sudah ada di dalam grup tersebut.`, m, { quoted: fkontak });
        }
    } else {
        return conn.reply(m.chat, '❌ Link grup atau ID Grup tidak valid.', m, { quoted: fkontak });
    }
    
    let ownerNumbers = global.nomorown || [];
    if (!Array.isArray(ownerNumbers)) {
        ownerNumbers = [ownerNumbers];
    }
    
    let ownerJids = ownerNumbers
        .map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        .filter(jid => jid.length > 10);
        
    if (ownerJids.length === 0) {
        return conn.reply(m.chat, '⚠️ Nomor owner (global.nomorown) belum diatur di *config.js*', m, { quoted: fkontak });
    }

    await conn.reply(m.chat, `*🆔 ID:* ${gid}\n> Sekarang mencoba mempromosikan owner...`, m, { quoted: fkontak });
    
    let successJids = [];
    let errorJids = [];
    for (const jid of ownerJids) {
        try {
            await conn.groupParticipantsUpdate(gid, [jid], 'promote');
            successJids.push(jid);
            await delay(500);
        } catch (e) {
            console.error(`❌ Gagal promote ${jid}:`, e);
            errorJids.push({ jid, error: e.message || 'Error tidak diketahui' });
        }
    }

    // 5. Kirim Laporan Hasil
    let resultText = '✨ *Hasil Operasi Promote Owner:*\n\n';
    
    if (successJids.length > 0) {
        resultText += `✅ *Berhasil Dipromosikan:*\n${successJids.map(jid => `@${jid.split('@')[0]}`).join('\n')}\n\n`;
    }
    
    if (errorJids.length > 0) {
        resultText += `❌ *Gagal Dipromosikan:*\n`;
        resultText += errorJids.map(e => `@${e.jid.split('@')[0]} (Error: ${e.error})`).join('\n') + '\n\n';
        resultText += `\n*Penyebab Umum:*\n1. Saya bukan admin di grup tersebut.\n2. Owner sudah menjadi admin.\n3. Owner tidak ada di dalam grup.`;
    }

    await conn.reply(m.chat, resultText.trim(), m, {
        quoted: fkontak,
        mentions: [...successJids, ...errorJids.map(e => e.jid)]
    });

  } catch (e) {
    console.error('[PROMOTE2 ERROR]', e);
    await conn.reply(m.chat, `❌ Gagal total!\n\n${e.message}`, m, { quoted: fkontak });
  }
}

handler.help = ['promoteme <linkgrup/idgrup>']
handler.tags = ['owner']
handler.command = /^(promoteme)$/i
handler.owner = true

export default handler