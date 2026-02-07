const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler = async(m, { text, conn, usedPrefix, command }) => {
     conn.buy = conn.buy || {};
     let buy = conn.buy[m.chat]
let caption = `*Toko Ini Menyediakan Item Seperti:*\n* 📅 Premium\n* 💵 Money\n* 💳 Limit\n\n\`Di toko ini pembayaran menggunakan Cash, Cash di dapatkan hanya dengan cara topup, caranya?\`\n*Ketik:* !topup`
let sections = [{
		title: '[ Premium VIP ]',
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "📅 1 Hari",
	description: ": ʀᴘ 1,000",
	id: '.premp1'
	},
	{
		header: '', 
		title: "📅 3 Hari", 
		description: ": ʀᴘ.2,000",
		id: '.premp2'
  },
		{
		header: '', 
		title: "📅 1 Minggu", 
		description: ": ʀᴘ.6,000",
		id: '.premp3'
		},
		{
		header: '', 
		title: "📅 1 Bulan",
		description: ": ʀᴘ.12,000",
		id: '.premp4'
	}]
}]
	sections.push({
	title: '[ List Money ]',
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "💵 Money 250jt",
	description: ": ʀᴘ 1,000 Cash",
	id: '.moneyp1'
	},
	{
		header: '', 
		title: "💵 Money 550Jt", 
		description: ": ʀᴘ.2,000 Cash",
		id: '.moneyp2'
  },
		{
		header: '', 
		title: "💵 Money 2M", 
		description: ": ʀᴘ.5,000 Cash",
		id: '.moneyp3'
		},
		{
		header: '', 
		title: "💵 Money 7M",
		description: ": ʀᴘ.11,000 Cash",
		id: '.moneyp4'
	}]
})
sections.push({
	title: '[ List Limit ]',
		highlight_label: '', 
		rows: [{
			header: '', 
	title: "💳 Limit 1000",
	description: ": ʀᴘ 500 Cash",
	id: '.limitp1'
	},
	{
		header: '', 
		title: "💳 Limit 2,500", 
		description: ": ʀᴘ.1,500 Cash",
		id: '.limitp2'
  },
		{
		header: '', 
		title: " 💳 Limit 5,000", 
		description: ": ʀᴘ.2,500 Cash",
		id: '.limitp3'
		},
		{
		header: '', 
		title: "💳 Limit 13,000",
		description: ": ʀᴘ.5,000 Cash",
		id: '.limitp4'
	}]
})

let listMessage = {
    title: 'Item List', 
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
            text: caption,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '*© Lann4you!*',
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: '\t*Shop Cash 💰*\n',
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
     conn.buy[m.chat] = {
         buyyers: m.sender,
         status: true,
         waktu: setTimeout(() => {
         if (conn.buy[m.chat]) m.reply(`Transaksi Batal`)
         delete conn.buy[m.chat]
         }, 500000),
      }
}
handler.tag = ['rpg']
handler.help = ['buy','tokoLann4you']
handler.command = /^(buy|tokoLann4you)/i

export default handler