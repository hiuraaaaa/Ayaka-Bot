import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Masukkan username akun panel yang ingin dihapus.\n\nContoh: .delpanel ubed')

  const username = text.trim().toLowerCase()
  const domain = "https://panell.flfc.my.id"
  const apikey = "ptla_wbRItxW26DZ2vDHN6lYzW69Z9xSiajgtu2TjYMpGPKD"

  try {
    // Cari user berdasarkan username
    const res = await fetch(`${domain}/api/application/users?per_page=100`, {
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json"
      }
    })

    const data = await res.json()
    if (!data || !data.data) return m.reply("❌ Gagal mengambil data user")

    const user = data.data.find(u => u.attributes.username === username)
    if (!user) return m.reply(`❌ User "${username}" tidak ditemukan.`)

    const userId = user.attributes.id

    // Hapus semua server milik user
    const res2 = await fetch(`${domain}/api/application/users/${userId}?include=servers`, {
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json"
      }
    })

    const userDetails = await res2.json()
    const servers = userDetails.attributes.relationships?.servers?.data || []

    for (const server of servers) {
      const serverId = server.attributes.id
      await fetch(`${domain}/api/application/servers/${serverId}/force`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + apikey,
          Accept: "application/json"
        }
      })
    }

    // Hapus user
    await fetch(`${domain}/api/application/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json"
      }
    })

    m.reply(`✅ Berhasil menghapus akun panel dan server milik *${username}*.`)

  } catch (err) {
    console.error(err)
    m.reply(`❌ Terjadi kesalahan:\n${err.message}`)
  }
}

handler.command = /^delpanel$/i
handler.owner = true
handler.tags = ['panel']
handler.help = ['delpanel <username>']

export default handler