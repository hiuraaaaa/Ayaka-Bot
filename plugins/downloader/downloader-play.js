import yts from 'yt-search';
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
let timeout = 500000;

async function handler(m, { conn, text, usedPrefix, command }) {
  conn.play = conn.play || {};
  if (!text) return m.reply(`Cari Lagu / Video yang anda mau\n*Contoh :* ${usedPrefix + command} Pilihan hatiku`);

  m.reply('Tunggu sebentar...');
  let search = await yts(text);
  let vid = search.videos[0];
  if (!vid) return m.reply(`Video \`${text}\` tidak ditemukan.`);

  let { title, thumbnail, timestamp, views, ago, url, author } = vid;
  let { name } = author;

  let caption = `⬣─「 *YOUTUBE PLAY* 」─⬣
*• Title:* ${title}
*• Author:* ${name}
*• Views:* ${formatNumber(views)}
*• Duration:* ${timestamp}
*• Upload:* ${ago}
*• URL:* ${url}
*• Channel:* ${author.url}
⬣────────────────⬣`;

  let sections = [{
    title: 'YouTube Downloader',
    rows: [
      {
        title: `Download Audio`,
        description: `Audio dari ${title}`,
        id: `${usedPrefix}ytmp3 ${url}`
      },
      {
        title: `Download Video`,
        description: `Video dari ${title}`,
        id: `${usedPrefix}ytmp4 ${url}`
      }
    ]
  }];

  let listMessage = {
    title: 'Pilih Format',
    sections
  };

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: caption },
          footer: { text: `© ${global.namebot} | Rijalganzz Owner` },
          header: {
            title: '',
            hasMediaAttachment: true,
            ...(await prepareWAMessageMedia({ image: { url: thumbnail } }, { upload: conn.waUploadToServer }))
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify(listMessage)
              }
            ]
          }
        })
      }
    }
  }, {});

  conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  conn.play[m.sender] = {
    title,
    thumbnail,
    timestamp,
    views,
    ago,
    url,
    author,
    status: 'wait',
    sender: m.sender,
    chat: m.chat,
    msgId: msg.key.id,
    waktu: setTimeout(() => {
      conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: true,
          id: msg.key.id
        }
      });
      delete conn.play[m.sender];
    }, timeout)
  };
}

handler.tags = ['downloader'];
handler.help = ['play <judul>'];
handler.command = /^(play)$/i;
handler.register = true;
handler.limit = true;

export default handler;

function formatNumber(num) {
  const suffixes = ['', 'Rb', 'Jt', 'T', 'Kl'];
  const numString = Math.abs(num).toString();
  const numDigits = numString.length;
  if (numDigits <= 3) return numString;

  const suffixIndex = Math.floor((numDigits - 1) / 3);
  let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);
  if (formattedNum.endsWith('.0')) formattedNum = formattedNum.slice(0, -2);
  return formattedNum + suffixes[suffixIndex];
}