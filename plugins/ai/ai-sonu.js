/**
 * 🎶 Sonu AI Music Generator
 * 💫 Created by: OMEGATECH
 * 🔗 API: https://omegatech-api.dixonomega.tech
 * ✨ Modified: 𝐅𝐚𝐫𝐢𝐞𝐥
 */

import fetch from "node-fetch";

// --- KONFIGURASI FKONTAK (Seperti ai-sora.js) ---
const fkontak = {
 key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
 message: { conversation: `🎶 Sonu AI Music` }
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args.length) 
      throw new Error(`*🎧 Usage:* ${usedPrefix + command} lyrics|style|instruments
*✨ Example:* ${usedPrefix + command} I love you|Sad|jazz,classic
*💃 Style:* Happy, sad, romantic, energetic,  peaceful, melancholic, angry, hopeful, nostalgic, uplifting
*🎹 Instruments:* Pop, rock, folk, rap, mb, jazz, classical, electronic, blues, country`);

    const [lyricsRaw, styleRaw = "Anthem", instrumentRaw = "Classic"] = args.join(" ").split("|").map(a => a.trim());

    if (!lyricsRaw) 
      throw new Error(`❗Lyrics cannot be empty.`);

    // Send loading message (menggunakan fkontak)
    let loadingMsg = await conn.sendMessage(m.chat, { text: `🎶 *Sonu AI Music Generation Started...*\n*📝 Lyrics:* ${lyricsRaw}\n*🎨 Style:* ${styleRaw}\n*🎹 Instruments:* ${instrumentRaw}\n${global.wait}` }, { quoted: fkontak });

    // Call API
    const query = new URLSearchParams({ lyrics: lyricsRaw, style: styleRaw, instrument: instrumentRaw });
    const res = await fetch(`https://omegatech-api.dixonomega.tech/api/ai/Sonu?${query.toString()}`);
    const json = await res.json();

    if (!json.success || !json.results?.length)
      throw new Error(`❌ Generation failed or no results returned.`);

    const first = json.results[0];

    await conn.sendMessage(m.chat, {
      image: { url: first.cover },
      caption: `✅ *Sonu AI Music Generated!*\n*📝 Lyrics:* ${lyricsRaw}\n*🎨 Style:* ${styleRaw}\n*🎹 Instruments:* ${instrumentRaw}\n> © 2025 ${global.namebot}`
    }, { quoted: fkontak });

    await conn.sendMessage(m.chat, {
      audio: { url: first.audio },
      mimetype: "audio/mpeg",
      fileName: "sonu.mp3", 
    }, { quoted: fkontak });
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
    const buttonId = `sonuother|${lyricsRaw}|${styleRaw}|${instrumentRaw}|1`;
    const sections = [
        {
            title: "Versions",
            rows: [
                { title: "🎵 Send Other Version", rowId: buttonId, description: "Get the second generated version." }
            ]
        }
    ];

    await conn.sendMessage(m.chat, {
        text: "Click below to get the next version.",
        footer: "Sonu AI Music",
        title: "Music Options",
        buttonText: "Versions", 
        sections
    }, { quoted: fkontak }); // Menggunakan fkontak

  } catch (e) {
    console.error("💀 Sonu Error:", e);
    // Kirim error (Menggunakan fkontak)
    await conn.sendMessage(m.chat, { text: `❌ *Sonu Music Generation Failed.*\n💨 Error:\n${e.message}\n> © 2025 ${global.namebot}` }, { quoted: fkontak });
  }
};

// Handler untuk Tombol List
handler.button = async (m, { conn, buttonId }) => {
  try {
    if (!buttonId.startsWith("sonuother")) return;
    const [, lyricsRaw, styleRaw, instrumentRaw, indexStr] = buttonId.split("|");
    let index = parseInt(indexStr);

    const query = new URLSearchParams({ lyrics: lyricsRaw, style: styleRaw, instrument: instrumentRaw });
    const res = await fetch(`https://omegatech-api.dixonomega.tech/api/ai/Sonu?${query.toString()}`);
    const json = await res.json();

    if (!json.success || !json.results?.[index])
      return conn.sendMessage(m.chat, { text: "⚠️ No other version available." }, { quoted: fkontak }); // Pakai fkontak

    const item = json.results[index];

    await conn.sendMessage(m.chat, {
      image: { url: item.cover },
      caption: `✅ *Sonu AI Music Generated (Version ${index + 1})!*\n*📝 Lyrics:* ${lyricsRaw}\n*🎨 Style:* ${styleRaw}\n*🎹 Instruments:* ${instrumentRaw}\n> © 2025 ${global.namebot}`
    }, { quoted: fkontak });

    // 2. Kirim Audio (Menggunakan fkontak)
    await conn.sendMessage(m.chat, {
      audio: { url: item.audio },
      mimetype: "audio/mpeg",
      fileName: `sonu_v${index + 1}.mp3`
    }, { quoted: fkontak });

    // 3. Kirim Tombol List "Next" (jika ada)
    if (json.results?.[index + 1]) { 
        const nextButtonId = `sonuother|${lyricsRaw}|${styleRaw}|${instrumentRaw}|${index + 1}`;
        const sections = [
            {
                title: "Versions",
                rows: [
                    { title: "🎵 Send Next Version", rowId: nextButtonId, description: `Get version ${index + 2}.` }
                ]
            }
        ];
        
        await conn.sendMessage(m.chat, {
            text: "Click below to get the next version.",
            footer: "Sonu AI Music",
            title: "Music Options",
            buttonText: "Versions",
            sections
        }, { quoted: fkontak }); // Pakai fkontak
    }

  } catch (e) {
    console.error("💀 Sonu Button Error:", e);
    await conn.sendMessage(m.chat, { text: "💀 Failed to send other version." }, { quoted: fkontak }); // Pakai fkontak
  }
};

handler.help = ["sonu <lyrics|style|instruments>"];
handler.tags = ["ai", "premium"];
handler.command = /^sonu$/i;
handler.premium = true;
handler.limit = true;
handler.register = true;

export default handler;