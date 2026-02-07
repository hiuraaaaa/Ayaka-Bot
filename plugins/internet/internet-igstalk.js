import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
  if (!text) throw '🌸 Masukkan *username Instagram* dulu, senpai~!\n\nContoh: .igstalk mycyll.7'

  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key }})

  const formData = new URLSearchParams()
  formData.append('profile', text)

  try {
    const profileRes = await axios.post('https://tools.xrespond.com/api/instagram/profile-info', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'origin': 'https://bitchipdigital.com',
        'referer': 'https://bitchipdigital.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    })

    const raw = profileRes.data?.data?.data
    if (!raw || profileRes.data.status !== 'success') throw '⚠️ Profil tidak ditemukan, senpai~'

    const followers = raw.follower_count ?? 0

    const postsForm = new URLSearchParams()
    postsForm.append('profile', text)

    const postsRes = await axios.post('https://tools.xrespond.com/api/instagram/media/posts', postsForm.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'origin': 'https://bitchipdigital.com',
        'referer': 'https://bitchipdigital.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    })

    const items = postsRes.data?.data?.data?.items || []

    let totalLike = 0
    let totalComment = 0

    for (const post of items) {
      totalLike += post.like_count || 0
      totalComment += post.comment_count || 0
    }

    const totalEngagement = totalLike + totalComment
    const averageEngagementRate = followers > 0 && items.length > 0
      ? ((totalEngagement / items.length) / followers) * 100
      : 0

    const result = {
      username: raw.username || '-',
      name: raw.full_name || '-',
      bio: raw.biography || '-',
      followers,
      following: raw.following_count ?? 0,
      posts: raw.media_count ?? 0,
      profile_pic: raw.hd_profile_pic_url_info?.url || raw.profile_pic_url_hd || '',
      verified: raw.is_verified || raw.show_blue_badge_on_main_profile || false,
      engagement_rate: parseFloat(averageEngagementRate.toFixed(2))
    }

    const caption = `
🌸 *Instagram Stalker*
──────────────
📛 *Username:* @${result.username}
🧑‍🦱 *Nama:* ${result.name}
📝 *Bio:* ${result.bio}
📸 *Post:* ${result.posts}
👥 *Followers:* ${result.followers}
👣 *Following:* ${result.following}
📊 *Engagement:* ${result.engagement_rate}%
🔷 *Verified:* ${result.verified ? 'Iya~' : 'Belum~'}
`.trim()

    await conn.sendFile(m.chat, result.profile_pic, 'pp.jpg', caption, m)

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
    throw '😿 Gomen... tidak bisa stalk akun tersebut.'
  }
}

handler.help = ['igstalk <username>']
handler.tags = ['tools', 'internet']
handler.command = /^igstalk$/i

export default handler