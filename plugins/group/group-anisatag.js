let handler = async (m, { conn, text, participants, groupMetadata }) => {
let mem = m.isGroup ? await groupMetadata.participants.map(a => a.id) : ""
conn.sendMessage(m.chat, {
	text: `@${m.chat} ${text}`,
	contextInfo: {
mentionedJid: mem, 
		groupMentions: [
			{
				groupSubject: `\`<>Lann4youOfc<>\``,
				groupJid: m.chat,
			},
		],
	},
});
}
handler.help = ['Lann4youtag']
handler.tags = ['group']
/*handler.customPrefix = /^(@everyone)$/i
handler.command = new RegExp*/
handler.command = /^(Lann4youtag)$/i
handler.group = true
handler.admin = true

export default handler