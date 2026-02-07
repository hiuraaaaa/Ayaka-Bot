import axios from 'axios'

async function stalkTwit(username) {
  if (!username) throw 'Mana username-nya?'

  const url = `https://twittermedia.b-cdn.net/viewer/?data=${encodeURIComponent(username)}&type=profile`
  const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': '*/*',
    'Origin': 'https://snaplytics.io',
    'Referer': 'https://snaplytics.io/'
  }

  try {
    const res = await axios.get(url, { headers })
    const { profile, tweets } = res.data

    if (!profile) throw '❌ Profil tidak ditemukan.'

    return {
      profile: {
        name: profile.name ?? '',
        username: profile.username ?? '',
        bio: profile.bio ?? '',
        avatar: profile.avatar_url ?? '',
        banner: profile.banner_url ?? '',
        stats: {
          tweets: profile.stats?.tweets ?? 0,
          following: profile.stats?.following ?? 0,
          followers: profile.stats?.followers ?? 0
        }
      },
      tweets: (tweets ?? []).map(tweet => ({
        id: tweet.id ?? '',
        text: tweet.text ?? '',
        date: tweet.created_at ?? '',
        stats: {
          replies: tweet.stats?.replies ?? 0,
          retweets: tweet.stats?.retweets ?? 0,
          likes: tweet.stats?.likes ?? 0,
          views: tweet.stats?.views ?? 0
        },
        media: Array.isArray(tweet.media)
          ? tweet.media.map(m => ({
              type: m?.type ?? '',
              url: m?.url ?? '',
              poster: m?.poster ?? ''
            }))
          : [],
        is_pinned: tweet.is_pinned ?? false
      }))
    }

  } catch (err) {
    console.error('❌ Error:', err?.message || err)
    throw 'Gagal mengambil data dari Twitter.'
  }
}

let handler = async (m, { text, args, usedPrefix, command, conn }) => {
  if (!text) return m.reply(`🚫 Contoh penggunaan:\n\n${usedPrefix + command} mrbeast`)

  m.reply('⏳ Mengambil data dari Twitter/X...')

  try {
    const result = await stalkTwit(text)
    const p = result.profile

    let caption = `
👤 *Profil Twitter*
• 👥 Nama: ${p.name}
• 🆔 Username: @${p.username}
• 🧬 Bio: ${p.bio || '-'}
• 📝 Tweets: ${p.stats.tweets}
• 👣 Following: ${p.stats.following}
• 👥 Followers: ${p.stats.followers}
`.trim()

    await conn.sendFile(m.chat, p.avatar, 'avatar.jpg', caption, m)

    if (result.tweets.length) {
      let preview = result.tweets.slice(0, 3).map((tw, i) => {
        return `📌 *Tweet ${i + 1}*
🗓️ ${tw.date}
💬 ${tw.text}
❤️ ${tw.stats.likes}  🔁 ${tw.stats.retweets}  💭 ${tw.stats.replies}`
      }).join('\n\n')
      m.reply(preview)
    }

  } catch (e) {
    m.reply(typeof e === 'string' ? e : '❌ Terjadi kesalahan saat mengambil data.')
  }
}

handler.help = ['stalkx <username>']
handler.tags = ['tools', 'internet']
handler.command = ['stalkx', 'stalktwitter']
handler.limit = true

export default handler