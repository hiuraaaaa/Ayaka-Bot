const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  global.db.data.users[m.sender].pickaxe = global.db.data.users[m.sender].pickaxe || 0
  global.db.data.users[m.sender].pedang = global.db.data.users[m.sender].pedang || 0
  global.db.data.users[m.sender].fishingrod = global.db.data.users[m.sender].fishingrod || 0
  
  //----------HARGA
  let hanjing = 2
  let hkucing = 2
  let hkuda = 4
  let hrubah = 6
  let hrobo = 10
  
  let hlion = 10
  let hrhinoceros = 10
  let hnaga = 10
  let hcentaur = 10
  let hkyubi = 10
  let hgriffin = 10
  let hphonix = 10
  let hserigala = 10

let logo = '`PET STORE`\n'
let caption = `

 N O R M A L 
🐈 *Kucing:* ${hkucing} 🪙
🐕 *Anjing:* ${hanjing} 🪙
🐎 *Kuda:* ${hkuda} 🪙
🦊 *Rubah:* ${hrubah} 🪙

 S P E C I A L 
🐉 *Naga:* ${hnaga} 🪙
🦊 *Kyubi:* ${hkyubi} 🪙
🦅 *Elang:* ${hgriffin} 🪙
🦤 *Phonix:* ${hphonix} 🪙
🐺 *Serigala:* ${hserigala} 🪙

 A B I L I T Y 
➞ 🐈 • ᴄᴀᴛ :
- ɪɴᴄʀᴇᴀsᴇ ʜᴇᴀʟᴛʜ 5% / ʟᴇᴠᴇʟ ᴡʜᴇɴ ᴜsᴇ *.ʜᴇᴀʟ*

➞ 🐕 • ᴅᴏɢ :
- ᴄᴏᴍɪɴɢ sᴏᴏɴ...

➞ 🐎 • ʜᴏʀsᴇ :
- ᴄᴏᴍɪɴɢ sᴏᴏɴ...

➞ 🦊 • ғᴏx :
- ᴄᴏᴍɪɴɢ sᴏᴏɴ...
`

let sections = [{
		title: 'Pet Store',
		highlight_label: '', 
		rows: [{
			header: '', 
	title: `🐈 Kucing`,
	description: `Beli Kucing`,
	id: '.petshop kucing'
	},{
			header: '', 
	title: `🐎 Kuda`,
	description: `Beli Kuda`,
	id: '.petshop kuda'
	},{
			header: '', 
	title: `🦊 Rubah`,
	description: `Beli Rubah`,
	id: '.petshop rubah'
	},{
			header: '', 
	title: `🐕 Anjing`,
	description: `Beli Anjing`,
	id: '.petshop anjing'
	},
	{
		header: '', 
		title: `🦅 Elang`, 
		description: `Beli Elang`,
		id: '.petshop griffin'
	 },{
			header: '', 
	title: `🦖 Tirex`,
	description: `Beli Tirex`,
	id: '.petshop centaur'
	},{
			header: '', 
	title: `🐺 Serigala`,
	description: `Beli Serigala`,
	id: '.petshop wolf'
	},{
			header: '', 
	title: `🐉 Naga`,
	description: `Beli Naga`,
	id: '.petshop naga'
	},{
			header: '', 
	title: `🦊 Kyubi`,
	description: `Beli Kyubu`,
	id: '.petshop kyubi'
	}]
}]

let listMessage = {
    title: 'Pilih Disini', 
    sections
};

    let options = [];
    
    let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: caption,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: "`Ayaka | © Lann4you!`"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: 'ADOPT ME 🐾',
                    subtitle: "",
                    hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/23242276e10afb8f22cda.png`  } }, { upload: conn.waUploadToServer }))
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
        },
    }
}, {})

  try {
    if (/petshop/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'kucing':
          if (user.kucing > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hkucing) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hkucing
            global.db.data.users[m.sender].kucing += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
          case 'anjing':
          if (user.anjing > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hanjing) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hanjing
            global.db.data.users[m.sender].anjing += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
          case 'rubah':
          if (user.rubah > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hrubah) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hrubah
            global.db.data.users[m.sender].rubah += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
          case 'kuda':
          if (user.kuda > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hkuda) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hkuda
            global.db.data.users[m.sender].kuda += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
          case 'robo':
          if (user.robo > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hrobo) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hrobo
            global.db.data.users[m.sender].robo += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'lion':
          if (user.lion > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hlion) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hlion
            global.db.data.users[m.sender].lion += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'rhinoceros':
          if (user.rhinoceros > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hrhinoceros) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hrhinoceros
            global.db.data.users[m.sender].rhinoceros += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'naga':
          if (user.naga > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hnaga) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hnaga
            global.db.data.users[m.sender].naga += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'centaur':
          if (user.centaur > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hcentaur) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hcentaur
            global.db.data.users[m.sender].centaur += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'kyubi':
          if (user.kyubi > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hkyubi) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hkyubi
            global.db.data.users[m.sender].kyubi += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'griffin':
          if (user.griffin > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hgriffin) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hgriffin
            global.db.data.users[m.sender].griffin += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'phonix':
          if (user.phonix > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hphonix) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hphonix
            global.db.data.users[m.sender].phonix += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            case 'wolf':
          if (user.serigala > 0) return m.reply('Kamu sudah memilik ini')
            if(user.emas < hserigala) return m.reply(`🪙 Emas Anda Kurang, Silahkan Beli Di Shop!!`)
            global.db.data.users[m.sender].emas -= hserigala
            global.db.data.users[m.sender].serigala += 1
            m.reply("Selamat anda mempunyai pet Baru ! 🎉")
            break
            
          default:
            return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id, })
        }
    } else if (/enchant|enchan/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 't':
          break
        case '':
          break

        default:
          return conn.reply( m.chat, caption, m)
      }
    }
  } catch (err) {
    m.reply("Error\n\n\n" + err.stack)
  }

}

handler.help = ['petshop']
handler.tags = ['rpg']
handler.command = /^(petshop)/i

export default handler