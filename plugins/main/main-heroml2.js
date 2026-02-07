import axios from 'axios'

const handler = async (m, { text, command, prefix }) => {
  if (!text) {
    return m.reply(`Contoh : ${prefix + command} Zilong`)
  }
  await m.reply('Loading...')

  try {
    const response = await axios.get(`https://fastrestapis.fasturl.cloud/character/mlbb?name=${text}`)
    const data = response.data.result
    const teks = `
👤 *Nama:* ${data.name} 
🆔 *ID:* ${data.id} 
📖 *Story:* ${data.story} 

---

🖼️ *Media:* 
🌟 *Icon:* ${data.media.icon} 
🖼️ *Png:* ${data.media.png} 
🖼️ *Potrait:* ${data.media.potrait} 
🖼️ *Head:* ${data.media.head} 
🖼️ *Header:* ${data.media.header} 

---

🛡️ *Role:* 
${data.role.map(role => `Role: ${role.name}, ID: ${role.id}, Icon: ${role.icon}`).join('\n')} 

🛣️ *Lane:* 
${data.lane.map(lane => `Lane: ${lane.name}, ID: ${lane.id}, Icon: ${lane.icon}`).join('\n')} 

---

⚡ *Ability:* 
💪 *Durability:* ${data.ability.durability} 
⚔️ *Offense:* ${data.ability.offense} 
✨ *Ability Effects:* ${data.ability.ability_effects} 
💼 *Difficulty:* ${data.ability.difficulty} 

---

🎯 *Skills:* 
${data.skills.map(skill => `Nama Skills: ${skill.name}, Desc: ${skill.desc}, Video: ${skill.video}, Cooldown: ${skill.cooldown}, Mana Cost: ${skill.mana_cost}`).join('\n')} 

---

🔍 *Difficulty:* ${data.difficulty} 
🌟 *Speciality:* ${data.speciality.join(', ')}
`
    await m.reply(teks)
  } catch (err) {
    await m.reply('Hadehhh error')
  }
}

handler.help = ['heroml']
handler.tags = ['main']
handler.command = /^(heroml2|mlhero)$/i
handler.register = false

export default handler