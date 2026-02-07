let handler = async (m, { conn, text, prefix, command }) => {
  await conn.sendMessage(m.chat, {
    react: { text: '🍏', key: m.key }
  })

  if (!text || isNaN(Number(text))) {
    return m.reply(`Contoh penggunaan: ${prefix + command} 6283182739135`)
  }

  function getAngkaShuzi() {
    return Math.floor(Math.random() * 9) + 1
  }

  const energiPositifPilihan = ['Baik', 'Cukup', 'Sehat', 'Bahagia', 'Stabil', 'Kuat', 'Lancar', 'Sukses', 'Damai']
  const energiNegatifPilihan = ['Rendah', 'Sedang', 'Tinggi', 'Tidak ada', 'Sedikit', 'Bahaya', 'Kritis']

  function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  let energi_positif = {
    kekayaan: randomFromArray(energiPositifPilihan),
    kesehatan: randomFromArray(energiPositifPilihan),
    cinta: randomFromArray(energiPositifPilihan),
    kestabilan: randomFromArray(energiPositifPilihan),
    persentase: (Math.floor(Math.random() * 51) + 50) + '%'
  }

  let energi_negatif = {
    perselisihan: randomFromArray(energiNegatifPilihan),
    kehilangan: randomFromArray(energiNegatifPilihan),
    malapetaka: randomFromArray(energiNegatifPilihan),
    kehancuran: randomFromArray(energiNegatifPilihan),
    persentase: (Math.floor(Math.random() * 51)) + '%'
  }

  let msg = `• *Nomor HP :* ${text}\n` +
            `• *Angka Shuzi :* ${getAngkaShuzi()}\n` +
            `• *Energi Positif :*\n` +
            `  - Kekayaan : ${energi_positif.kekayaan}\n` +
            `  - Kesehatan : ${energi_positif.kesehatan}\n` +
            `  - Cinta : ${energi_positif.cinta}\n` +
            `  - Kestabilan : ${energi_positif.kestabilan}\n` +
            `  - Persentase : ${energi_positif.persentase}\n` +
            `• *Energi Negatif :*\n` +
            `  - Perselisihan : ${energi_negatif.perselisihan}\n` +
            `  - Kehilangan : ${energi_negatif.kehilangan}\n` +
            `  - Malapetaka : ${energi_negatif.malapetaka}\n` +
            `  - Kehancuran : ${energi_negatif.kehancuran}\n` +
            `  - Persentase : ${energi_negatif.persentase}`

  m.reply(msg)
}

handler.help = ['nomerhoki <nomor>', 'nomorhoki <nomor>']
handler.tags = ['fun']
handler.command = /^(nomerhoki|nomorhoki)$/i

export default handler