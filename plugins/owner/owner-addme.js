import fetch from 'node-fetch'
import pkg from '@adiwajshing/baileys'
const { getBinaryNodeChild, getBinaryNodeChildren } = pkg
const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { conversation: `Add Group Owner 👥` }
};

let handler = async (m, { conn, usedPrefix, command, text, participants }) => {
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
            await conn.groupMetadata(gid);
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

    await conn.reply(m.chat, `*🆔 ID:* ${gid}\n> Sekarang mencoba menambahkan owner...`, m, { quoted: fkontak });
    let response = await conn.query({
      tag: 'iq',
      attrs: {
        type: 'set',
        xmlns: 'w:g2',
        to: gid,
      },
      content: ownerJids.map(jid => ({
        tag: 'add',
        attrs: {},
        content: [{ tag: 'participant', attrs: { jid } }]
      }))
    });
    
    const add = getBinaryNodeChild(response, 'add');
    const participant = getBinaryNodeChildren(add, 'participant');
    
    let successJids = [];
    let error403Jids = [];
    let otherErrors = [];

    for (const user of participant) {
        let jid = user.attrs.jid;
        let error = user.attrs.error;

        if (error) {
            if (error === '403') {
                const content = getBinaryNodeChild(user, 'add_request');
                const invite_code = content.attrs.code;
                const invite_code_exp = content.attrs.expiration;
                error403Jids.push({ jid, invite_code, invite_code_exp });
            } else {
                otherErrors.push({ jid, error });
            }
        } else {
            successJids.push(jid);
        }
    }
    let resultText = '✨ *Hasil Operasi Add Owner:*\n\n';
    
    if (successJids.length > 0) {
        resultText += `✅ *Berhasil Ditambahkan:*\n${successJids.map(jid => `@${jid.split('@')[0]}`).join('\n')}\n\n`;
    }
    
    if (error403Jids.length > 0) {
        resultText += `⚠️ *Gagal (Butuh Invite):*\n`;
        resultText += error403Jids.map(e => `@${e.jid.split('@')[0]} (Kode: ${e.invite_code})`).join('\n') + '\n\n';
    }
    
    if (otherErrors.length > 0) {
        resultText += `❌ *Gagal (Error Lain):*\n`;
        resultText += otherErrors.map(e => `@${e.jid.split('@')[0]} (Error: ${e.error})`).join('\n') + '\n\n';
    }
    
    if (successJids.length === 0 && error403Jids.length === 0 && otherErrors.length > 0) {
         resultText += `\n*Penyebab Umum:*\n1. Saya bukan admin di grup tersebut.\n2. Grup diatur agar "Hanya Admin" yang bisa menambah anggota.`;
    }

    await conn.reply(m.chat, resultText.trim(), m, {
        quoted: fkontak,
        mentions: [...successJids, ...error403Jids.map(e => e.jid), ...otherErrors.map(e => e.jid)]
    });

  } catch (e) {
    console.error('[ADD2 ERROR]', e);
    await conn.reply(m.chat, `❌ Gagal total!\n\n${e.message}`, m, { quoted: fkontak });
  }
}

handler.help = ['addme <linkgrup/idgrup>']
handler.tags = ['owner']
handler.command = /^(addme)$/i
handler.owner = true

export default handler