let handler = async (m, { text, command, usedPrefix }) => {
    if (!text) throw `Use example ${usedPrefix}${command} Aku bisa pintar?`
    m.reply(`Pertanyaan : ${command} ${text}\nKemungkinan : ${[
        '10%',
        '20%',
        '30%',
        '40%',
        '50%',
        '70%',
        '80%',
        '90%',
        '100%',        
    ].getRandom()}.`)
}
handler.help = ['kemungkinan'].map(v => v + ' <teks>')
handler.tags = ['fun']

handler.command = /^(kemungkinan|mungkin)$/i

export default handler