let handler = async (m, { conn, text, participants, groupMetadata }) => {
let mem = m.isGroup ? await groupMetadata.participants.map(a => a.id) : ""
conn.sendMessage(m.chat, {
	text: `@${m.chat} ${text}`,
	contextInfo: {
mentionedJid: mem, 
		groupMentions: [
			{
				groupSubject: `Semua`,
				groupJid: m.chat,
			},
		],
	},
});
}
handler.help = ['everyone']
handler.tags = ['group']
/*handler.customPrefix = /^(@everyone)$/i
handler.command = new RegExp*/
handler.command = /^(everyone)$/i
handler.group = true
handler.admin = true

export default handler