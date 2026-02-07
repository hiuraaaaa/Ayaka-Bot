import axios from 'axios'

async function npmstalk(packageName) {
  let stalk = await axios.get("https://registry.npmjs.org/" + packageName)
  let versions = stalk.data.versions
  let allver = Object.keys(versions)
  let verLatest = allver[allver.length - 1]
  let verPublish = allver[0]
  let packageLatest = versions[verLatest]

  return {
    name: packageName,
    versionLatest: verLatest,
    versionPublish: verPublish,
    versionUpdate: allver.length,
    latestDependencies: Object.keys(packageLatest.dependencies || {}).length,
    publishDependencies: Object.keys(versions[verPublish].dependencies || {}).length,
    publishTime: stalk.data.time.created,
    latestPublishTime: stalk.data.time[verLatest]
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: 'Masukkan nama package NPM!\nContoh: .npmstalk axios' }, { quoted: m })

  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  })

  try {
    const info = await npmstalk(text.trim())

    let message = 
      `📦 *NPM Package Info: ${info.name}*\n\n` +
      `🔖 Versi Terbaru: ${info.versionLatest}\n` +
      `📌 Versi Awal: ${info.versionPublish}\n` +
      `📅 Diterbitkan: ${new Date(info.publishTime).toLocaleString()}\n` +
      `⏱️ Update Terakhir: ${new Date(info.latestPublishTime).toLocaleString()}\n\n` +
      `📊 Jumlah Update: ${info.versionUpdate} versi\n` +
      `📦 Dependency Terbaru: ${info.latestDependencies}\n` +
      `📦 Dependency Awal: ${info.publishDependencies}`

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })

    await conn.sendMessage(m.chat, { text: message }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    })
    await conn.sendMessage(m.chat, { text: 'Gagal mengambil data package. Pastikan nama package benar.' }, { quoted: m })
  }
}

handler.command = /^npmstalk$/i
handler.tags = ['tools']
handler.help = ['npmstalk <package>']
handler.limit = true;
handler.register = true;

export default handler