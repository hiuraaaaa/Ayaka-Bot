const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
import uploadImage from '../lib/uploadImage.js';

let handler = async(m, { conn, text }) => {
    conn.topup = conn.topup || {};
    let proses = conn.topup[m.chat];

    if (!proses) {
        let nom = `🛒 Pilih nomonal yang anda inginkan, jangan bermain-main dengan fitur ini!`
    let sections = [{
		title: wm, 
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "💰 1,500 Cash",
	description: ": ʀᴘ 1,000",
	id: '.satu'
	},
	{
		header: '', 
		title: "💰 2,500 Cash", 
		description: ": ʀᴘ.2,000",
		id: '.dua'
		},
		{
		header: '', 
		title: "💰 6,000 Cash", 
		description: ": ʀᴘ.5,000",
		id: '.lima'
		},
		{
		header: '', 
		title: "💰 12,000 Cash",
		description: ": ʀᴘ.10,000",
		id: '.sepu'
		},
		{
		header: '', 
		title: "💰 18,000 Cash",
		description: ": ʀᴘ.15,000",
		id: '.libel'
		},
		{
		header: '', 
		title: "💰 25,000 Cash",
		description: ": ʀᴘ.20,000",
		id: '.dupu'
	}]
}]

let listMessage = {
    title: 'PAyaka List', 
    sections
};

    let options = [];

    let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: nom,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '*© Lann4you!*',
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: '\t*🛍️ Top Up Cash*\n',
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(listMessage) 
              }
           ],
          })
        })
    }
  }
}, { quoted: m})

   await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id})
        
        conn.topup[m.chat] = {
            buyer: m.sender,
            room: m.chat,
            status: 'proses',
            waktu: setTimeout(() => {
                if (conn.topup[m.chat]) conn.reply(m.chat, 'Proses Dibatalkan', m);
                delete conn.topup[m.chat];
            }, 500000),
        };
    } else {
        conn.reply(m.chat, `⚠️ Selesaikan transaksimu yang sebelumnya`, m);
    }
}

handler.command = /^(topup|cash)/i;
handler.private = false
handler.register = true
 export default handler;