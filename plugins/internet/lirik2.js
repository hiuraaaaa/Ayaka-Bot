import axios from "axios";

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: '0@s.whatsapp.net',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: `Searching Lyric Music 🎶`,
  },
};

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let query = text || m.quoted?.text;
    if (!query) {
        return conn.sendMessage(
            m.chat, {
                text: `Where are the lyrics? Example: ${usedPrefix + command} I don't love you`
            }, {
                quoted: fkontak
            }
        );
    }

    await conn.reply(m.chat, global.wait, m, { quoted: fkontak });

    try {
        let res = await axios.get(
            `https://apidl.asepharyana.tech/api/search/lyrics?query=${encodeURIComponent(query)}`
        );
        let data = res.data;

        if (!data || !data[0]) {
            return conn.sendMessage(
                m.chat, {
                    text: "Oops, the lyrics could not be found."
                }, {
                    quoted: fkontak
                    
                }
            );
        }

        let song = data[0];

        let message = `
*🎵 Judul:* ${song.name} 
*👤 Artis:* ${song.artistName}
*💿 Album:* ${song.albumName}
*⏳ Durasi:* ${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}
*🎻 Instrumental:* ${song.instrumental ? "Yes" : "No"}

*📝 Lirik:*
${song.plainLyrics}
`;

        await conn.sendMessage(
            m.chat, {
                text: message
            }, {
                quoted: fkontak
            }
        );
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (err) {
        await conn.sendMessage(
            m.chat, {
                text: `ERROR:\n\n${err.toString()}`
            }, {
                quoted: fkontak
            }
        );
        console.error(err);
    }
};

handler.help = ["lyrics"];
handler.tags = ["search"];
handler.command = ["lyrics2", "lirik2"];

export default handler;