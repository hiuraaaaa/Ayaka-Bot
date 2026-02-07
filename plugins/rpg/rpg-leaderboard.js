const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler= async(m, { conn, text }) => {
   
   let cap = `*Ayo Jadilah Pemimpin Dan Raih Juara!*\n[ *Note* ] Setiap Minggu Akan Diumumkan, Top Global Leaderboard Exp, Juara 🥇🥈🥉 Akan Mendapatkan Hadiah!\n\n*🎁 List Hadiah*\n* Money\n* Limit\n* Cash\n> Jadilah Pemenang!`
   
   let sections = [{
		title: wm, 
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "🧪 𝙀𝙭𝙥",
	description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴇxᴘ",
	id: '.lbexp'
	},
	{
		header: '', 
		title: "💵 𝙈𝙤𝙣𝙚𝙮", 
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴍᴏɴᴇʏ",
		id: '.lbmoney'
		},
		{
		header: '', 
		title: "💳 𝙇𝙞𝙢𝙞𝙩", 
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ʟɪᴍɪᴛ",
		id: '.lblimit'
		},
		{
		header: '', 
		title: "🌐 𝙎𝙪𝙗𝙨𝙘𝙧𝙞𝙗𝙚𝙧𝙨",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ꜱᴜʙꜱᴄʀɪʙᴇʀꜱ",
		id: '.lbsub'
		},
		{
		header: '', 
		title: "🎗️ 𝙇𝙚𝙫𝙚𝙡",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ʟᴇᴠᴇʟ",
		id: '.lblevel'
		},
		{
		header: '', 
		title: "💥 𝘿𝙖𝙢𝙖𝙜𝙚",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴅᴀᴍᴀɢᴇ",
		id: '.lbdamage'
		},
		{
		header: '', 
		title: "👨🏻‍🚀 𝘼𝙨𝙩𝙧𝙤𝙣𝙤𝙩",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴀꜱᴛʀᴏɴᴏᴛ",
		id: '.lbastro'
		}, 
		{
		header: '', 
		title: "🎶 𝙏𝙞𝙠𝙏𝙤𝙠",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴛɪᴋᴛᴏᴋ",
		id: '.lbtt'
		},
		{
		header: '', 
		title: "📸 𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ɪɴꜱᴛᴀɢʀᴀᴍ",
		id: '.lbig'
		},
		{
		header: '', 
		title: "💬 𝙏𝙬𝙞𝙩𝙩𝙚𝙧",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴛᴡɪᴛᴛᴇʀ",
		id: '.lbtw'
		},
		{
		header: '', 
		title: "🪨 𝙈𝙪𝙡𝙪𝙣𝙜",
		description: ": ᴛᴏᴘ ɢʟᴏʙᴀʟ ᴍᴜʟᴜɴɢ",
		id: '.lbmulung'
		},
   {
		header: '', 
		title: "🎁 𝙍𝙚𝙬𝙖𝙧𝙙",
		description: ": ʜᴀᴅɪᴀʜ ᴛᴏᴘ ɢʟᴏʙᴀʟ",
		id: '.lbreward'
	}]
}]

let listMessage = {
    title: 'Leaderboard', 
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
            text: cap,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '*© Lann4you!*',
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: '\t*🏆 Leaderboard User*\n',
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
}
handler.tags = ['rpg']
handler.help = ['lb','leaderboard']
handler.command = /^(leaderboard|lb|topglobal)$/i
handler.group = true

export default handler