/*
werewolf.mjs - ESM plugin for WhatsApp bot (Baileys-style)\n
Fitur lengkap Werewolf (Mafia) sederhana + polling WhatsApp (button-based)
- Commands: startww, joinww, leaveww, beginww, nightww, dayww, vote, lynch, wwstatus, endww, wwhelp, wwpoll
- Persists game state to global.db.data.werewolf (expects global.db exist)
- Works as a single-file ESM plugin (export default handler)

Catatan:
- Sesuaikan fungsi pengiriman pesan (conn.sendMessage) jika framework Anda berbeda.
- Tombol interaktif dibangun dengan format Baileys v4-ish. Jika Anda memakai versi lain, sesuaikan payload.
- Role default: villager, wolf, seer, hunter, doctor (konfigurasi mudah di GAME_DEFAULTS.roles)
- Polling WA: perintah wwpoll <pertanyaan>|<opsi1>|<opsi2>|... (membuat tombol pilihan cepat)

*/

// --- CONFIG ---
const GAME_DEFAULTS = {
  minPlayers: 5,
  maxPlayers: 25,
  nightDurationSec: 45,
  dayDurationSec: 90,
  roles: {
    wolf: 2,
    seer: 1,
    doctor: 1,
    hunter: 1,
    villager: 0 // villagers fill remaining slots
  }
}

// helper: ensure db structure
function ensureDB() {
  global.db = global.db || { data: {} }
  global.db.data.werewolf = global.db.data.werewolf || {}
}

// helper: random shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// create a new lobby
function createLobby(chat) {
  ensureDB()
  const id = chat
  const lobby = {
    id,
    host: null,
    players: [], // array of {id, name, role, alive, voted}
    started: false,
    phase: 'lobby', // lobby | night | day | ended
    round: 0,
    timers: {},
    votes: {}, // targetId -> [voterId...]
    logs: []
  }
  global.db.data.werewolf[id] = lobby
  return lobby
}

// get or create
function getLobby(chat) {
  ensureDB()
  if (!global.db.data.werewolf[chat]) return createLobby(chat)
  return global.db.data.werewolf[chat]
}

// assign roles
function assignRoles(lobby) {
  const counts = Object.assign({}, GAME_DEFAULTS.roles)
  const totalPlayers = lobby.players.length
  // compute villagers
  let assigned = 0
  for (const r of Object.keys(counts)) assigned += counts[r]
  counts.villager = Math.max(0, totalPlayers - assigned)

  const rolesList = []
  for (const [role, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) rolesList.push(role)
  }
  shuffle(rolesList)

  lobby.players = lobby.players.map((p, i) => ({
    ...p,
    role: rolesList[i] || 'villager',
    alive: true,
    voted: null
  }))
}

// utility: find player by jid
function findPlayer(lobby, jid) {
  return lobby.players.find(p => p.id === jid)
}

// send simple text
async function replyText(conn, chat, text, quoted = null) {
  try {
    await conn.sendMessage(chat, { text }, { quoted: quoted })
  } catch (e) {
    // fallback for other APIs
    try { await conn.sendMessage(chat, text) } catch (_) { }
  }
}

// send buttons
async function sendButtons(conn, chat, text, buttons = [], footer = '') {
  const payload = {
    text,
    footerText: footer || 'Werewolf Game',
    buttons: buttons.map((b, idx) => ({ buttonId: b.id || `ww_btn_${idx}`, buttonText: { displayText: b.title }, type: 1 }))
  }
  try {
    await conn.sendMessage(chat, payload)
  } catch (e) {
    // some frameworks use different fields
    await replyText(conn, chat, text)
  }
}

// create a quick buttons poll
async function createPoll(conn, chat, question, options = []) {
  const buttons = options.map((opt, i) => ({ id: `poll_${i}`, title: `${i + 1}. ${opt}` }))
  await sendButtons(conn, chat, `POLL: ${question}\n\nPilih salah satu:`, buttons)
}

// start night phase
async function startNight(conn, lobby) {
  lobby.phase = 'night'
  lobby.round += 1
  lobby.votes = {}
  lobby.logs.push(`Round ${lobby.round} - Night started`)

  // notify each role privately
  for (const p of lobby.players) {
    if (!p.alive) continue
    let pm = `Malam ronde ${lobby.round}. Anda adalah *${p.role}*.\n` +
      `Tunggu instruksi...`;
    if (p.role === 'wolf') pm += `\nDiskusikan dengan sesama wolf via chat sendiri (manual). Pilih target dengan: vote <@jid>`
    if (p.role === 'seer') pm += `\nAnda bisa menebak role pemain: gunakan command 'vote <jid>' untuk menebak. (hasil akan diberikan dini hari)`
    if (p.role === 'doctor') pm += `\nAnda bisa menyelamatkan satu orang (termasuk diri sendiri) dengan 'vote <jid>'`
    await replyText(conn, p.id, pm)
  }

  // announce public
  await replyText(conn, lobby.id, `🌙 *Malam telah tiba.* Semua peran gunakan perintah malamnya. Waktu: ${GAME_DEFAULTS.nightDurationSec}s`)

  // schedule end of night
  clearTimeout(lobby.timers.phase)
  lobby.timers.phase = setTimeout(async () => {
    await resolveNight(conn, lobby)
  }, GAME_DEFAULTS.nightDurationSec * 1000)
}

// resolve night actions (simple priority: doctor saves, wolf kills, seer reveals)
async function resolveNight(conn, lobby) {
  // collect choices
  const wolfVotes = {} // target -> count
  const doctorVotes = {} // target -> count
  const seerVotes = {} // target -> [seerId]

  for (const pid in lobby.votes) {
    const vote = lobby.votes[pid]
    const player = findPlayer(lobby, pid)
    if (!player || !player.alive) continue
    if (!vote) continue
    if (player.role === 'wolf') wolfVotes[vote] = (wolfVotes[vote] || 0) + 1
    if (player.role === 'doctor') doctorVotes[vote] = (doctorVotes[vote] || 0) + 1
    if (player.role === 'seer') seerVotes[player.id] = vote
  }

  // wolf target: highest votes
  let wolfTarget = null
  if (Object.keys(wolfVotes).length) {
    wolfTarget = Object.entries(wolfVotes).sort((a, b) => b[1] - a[1])[0][0]
  }

  // doctor save: highest doctor vote -> saved
  let saved = null
  if (Object.keys(doctorVotes).length) {
    saved = Object.entries(doctorVotes).sort((a, b) => b[1] - a[1])[0][0]
  }

  // seer reveal: send to seer privately
  for (const seerId in seerVotes) {
    const target = seerVotes[seerId]
    const targetPlayer = findPlayer(lobby, target)
    const roleText = targetPlayer ? targetPlayer.role : 'unknown'
    await replyText(conn, seerId, `🔮 Hasil ramalan: ${target} adalah *${roleText}*`)
  }

  // apply wolf kill if not saved
  if (wolfTarget && wolfTarget !== saved) {
    const victim = findPlayer(lobby, wolfTarget)
    if (victim) {
      victim.alive = false
      lobby.logs.push(`Night: ${victim.id} dibunuh oleh wolf.`)
      await replyText(conn, lobby.id, `💀 *Malam selesai.* ${victim.name || victim.id} ditemukan tewas saat pagi.`)
      // if victim is hunter, trigger hunter ability: choose someone to kill immediately (if implemented: here we auto-kill if voted)
      if (victim.role === 'hunter') {
        lobby.logs.push(`Hunter aktif: ${victim.id}`)
        // simplistic: hunter kills the largest voter (could be improved)
        const aliveOthers = lobby.players.filter(p => p.alive)
        if (aliveOthers.length) {
          const target = aliveOthers[0]
          target.alive = false
          lobby.logs.push(`Hunter ${victim.id} membalas dan membunuh ${target.id}`)
          await replyText(conn, lobby.id, `🔫 Hunter membalas dan membunuh ${target.name || target.id}`)
        }
      }
    }
  } else {
    await replyText(conn, lobby.id, `🌅 *Malam selesai.* Tidak ada korban malam ini.`)
  }

  // clear votes and move to day
  lobby.votes = {}
  lobby.phase = 'day'
  await startDay(conn, lobby)
}

async function startDay(conn, lobby) {
  lobby.logs.push(`Round ${lobby.round} - Day started`)
  await replyText(conn, lobby.id, `☀️ *Siang hari.* Diskusikan dan pilih siapa yang akan di-lynch. Waktu: ${GAME_DEFAULTS.dayDurationSec}s`)

  // announce alive players
  let aliveList = lobby.players.filter(p => p.alive).map(p => `- ${p.name || p.id}`).join('\n')
  await replyText(conn, lobby.id, `Pemain masih hidup:\n${aliveList}`)

  // schedule day end
  clearTimeout(lobby.timers.phase)
  lobby.timers.phase = setTimeout(async () => {
    await resolveDay(conn, lobby)
  }, GAME_DEFAULTS.dayDurationSec * 1000)
}

async function resolveDay(conn, lobby) {
  // count votes
  const counts = {}
  for (const voterId in lobby.votes) {
    const target = lobby.votes[voterId]
    if (!target) continue
    counts[target] = (counts[target] || 0) + 1
  }
  // get highest
  const entries = Object.entries(counts)
  if (!entries.length) {
    await replyText(conn, lobby.id, `Tidak ada voting saat siang. Lanjut ke malam.`)
    lobby.votes = {}
    lobby.phase = 'night'
    await startNight(conn, lobby)
    return
  }
  entries.sort((a, b) => b[1] - a[1])
  const top = entries[0]
  const targetId = top[0]
  const victim = findPlayer(lobby, targetId)
  if (victim) {
    victim.alive = false
    lobby.logs.push(`Day: ${victim.id} di-lynch.`)
    await replyText(conn, lobby.id, `⚖️ ${victim.name || victim.id} di-lynch oleh mayoritas suara.`)
    // hunter check
    if (victim.role === 'hunter') {
      const aliveOthers = lobby.players.filter(p => p.alive)
      if (aliveOthers.length) {
        const target = aliveOthers[0]
        target.alive = false
        lobby.logs.push(`Hunter aktif after lynch: ${victim.id} -> ${target.id}`)
        await replyText(conn, lobby.id, `🔫 Hunter membalas dan membunuh ${target.name || target.id}`)
      }
    }
  }

  // reset votes
  lobby.votes = {}

  // check win conditions
  const alive = lobby.players.filter(p => p.alive)
  const wolves = alive.filter(p => p.role === 'wolf')
  const villagers = alive.filter(p => p.role !== 'wolf')
  if (wolves.length === 0) {
    lobby.phase = 'ended'
    lobby.logs.push('Villagers win')
    await replyText(conn, lobby.id, '🎉 *Villagers menang!* Semua wolf tewas.')
    return
  }
  if (wolves.length >= villagers.length) {
    lobby.phase = 'ended'
    lobby.logs.push('Wolves win')
    await replyText(conn, lobby.id, '🐺 *Wolves menang!* Jumlah wolf >= pemain lain.')
    return
  }

  // continue to night
  lobby.phase = 'night'
  await startNight(conn, lobby)
}

// ------------------ HANDLER ------------------
let handler = async (m, { conn, args = [], usedPrefix = '', command = '' }) => {
  // m.key.remoteJid -> chat id, m.sender -> user id
  const chat = m.key.remoteJid
  const sender = m.sender
  const text = (args || []).join(' ').trim()
  ensureDB()
  const lobby = getLobby(chat)

  // commands routing
  const cmd = command.toLowerCase()

  // HELP
  if (/(^wwhelp$|^werewolfhelp$|^ww\?)/.test(cmd) || cmd === 'wwhelp') {
    const help = `*Werewolf Commands*\n
- startww : buat lobby baru\n- joinww : gabung ke lobby\n- leaveww : keluar dari lobby\n- beginww : host mulai pembagian peran / start game\n- vote <jid|@tag|number> : vote target (malam untuk peran), gunakan reply atau jid\n- wwstatus : cek status game\n- endww : akhiri game (host only)\n- wwpoll <pertanyaan>|<opsi1>|<opsi2>|... : buat polling`;
    await replyText(conn, chat, help)
    return
  }

  // create lobby
  if (cmd === 'startww') {
    if (lobby.started && lobby.phase !== 'ended') return await replyText(conn, chat, 'Lobby sudah dibuat. Gunakan joinww untuk ikut.')
    const newLobby = createLobby(chat)
    newLobby.host = sender
    newLobby.players = [{ id: sender, name: m.pushName || m.name || sender }]
    newLobby.started = false
    await replyText(conn, chat, `Lobby Werewolf dibuat oleh ${m.pushName || sender}. Gunakan joinww untuk bergabung. Host gunakan beginww untuk memulai.`)
    return
  }

  if (cmd === 'joinww') {
    if (!lobby || lobby.phase === 'ended') {
      createLobby(chat)
    }
    if (lobby.players.find(p => p.id === sender)) return await replyText(conn, chat, 'Anda sudah terdaftar di lobby.')
    if (lobby.started) return await replyText(conn, chat, 'Game sudah dimulai. Tunggu sampai selesai.')
    lobby.players.push({ id: sender, name: m.pushName || sender })
    await replyText(conn, chat, `${m.pushName || sender} bergabung ke lobby. (${lobby.players.length} pemain)`)
    return
  }

  if (cmd === 'leaveww') {
    const idx = lobby.players.findIndex(p => p.id === sender)
    if (idx === -1) return await replyText(conn, chat, 'Anda tidak ada di lobby.')
    lobby.players.splice(idx, 1)
    await replyText(conn, chat, `${m.pushName || sender} keluar dari lobby. (${lobby.players.length} pemain)`)
    return
  }

  if (cmd === 'beginww') {
    if (lobby.host !== sender) return await replyText(conn, chat, 'Hanya host yang boleh mulai game.')
    if (lobby.players.length < GAME_DEFAULTS.minPlayers) return await replyText(conn, chat, `Butuh minimal ${GAME_DEFAULTS.minPlayers} pemain.`)
    lobby.started = true
    assignRoles(lobby)
    lobby.phase = 'night'
    await replyText(conn, chat, `🔔 Game dimulai! Role sudah dibagikan secara privat.`)
    // send private role info
    for (const p of lobby.players) {
      await replyText(conn, p.id, `Anda mendapat role: *${p.role}*\nSelamat bermain!`)
    }
    await startNight(conn, lobby)
    return
  }

  if (cmd === 'wwstatus') {
    const playersList = lobby.players.map(p => `${p.name || p.id} - ${p.alive ? 'alive' : 'dead'}`).join('\n')
    await replyText(conn, chat, `Lobby: ${lobby.id}\nPhase: ${lobby.phase}\nPlayers:\n${playersList}`)
    return
  }

  if (cmd === 'endww') {
    if (lobby.host !== sender) return await replyText(conn, chat, 'Hanya host dapat mengakhiri game.')
    lobby.phase = 'ended'
    lobby.started = false
    await replyText(conn, chat, 'Game berakhir oleh host. Terima kasih!')
    delete global.db.data.werewolf[chat]
    return
  }

  // vote command (can be used day or night depending on role)
  if (cmd === 'vote' || cmd === 'lynch') {
    if (!lobby.started) return await replyText(conn, chat, 'Belum ada game berjalan di sini.')
    const player = findPlayer(lobby, sender)
    if (!player) return await replyText(conn, chat, 'Anda tidak terdaftar di game ini.')
    if (!player.alive) return await replyText(conn, chat, 'Anda sudah mati dan tidak bisa memilih.')

    // parse target: allow reply, jid, or name/number
    let targetId = null
    if (m.message && m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo && m.message.extendedTextMessage.contextInfo.participant) {
      targetId = m.message.extendedTextMessage.contextInfo.participant
    } else if (args[0] && args[0].includes('@')) {
      targetId = args[0]
    } else if (args[0]) {
      // try find by name
      const q = args.join(' ')
      const found = lobby.players.find(p => (p.name || '').toLowerCase() === q.toLowerCase())
      if (found) targetId = found.id
    }
    if (!targetId) return await replyText(conn, chat, 'Tidak bisa menentukan target. Gunakan reply ke pesan target atau sebutkan @jid atau nama.')

    // store vote
    lobby.votes[sender] = targetId
    await replyText(conn, chat, `${m.pushName || sender} memilih ${targetId}`)
    return
  }

  // create poll
  if (cmd === 'wwpoll') {
    // format: wwpoll question|opt1|opt2|...
    if (!text || !text.includes('|')) return await replyText(conn, chat, 'Format: wwpoll Pertanyaan|Opsi1|Opsi2|...')
    const parts = text.split('|').map(s => s.trim()).filter(Boolean)
    const q = parts.shift()
    await createPoll(conn, chat, q, parts)
    return
  }

  // quick status or unknown
  await replyText(conn, chat, 'Perintah tidak dikenali. Ketik wwhelp untuk daftar perintah.')
}

// export plugin metadata
handler.help = ['werewolf', 'ww']
handler.tags = ['game']
handler.command = /^(startww|joinww|leaveww|beginww|vote|lynch|wwstatus|endww|wwpoll|wwhelp)$/i

export default handler