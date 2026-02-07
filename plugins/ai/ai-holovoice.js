import axios from 'axios'
import FormData from 'form-data'

class RVCHoloID {
  constructor() {
    this.api_url = 'https://kit-lemonfoot-vtuber-rvc-models.hf.space'
    this.file_url = `${this.api_url}/file=`
    this.models = {
      moona: { fn: 44, file: ['Moona Hoshinova', 'weights/hololive-id/Moona/Moona_Megaaziib.pth', 'weights/hololive-id/Moona/added_IVF1259_Flat_nprobe_1_v2_mbkm.index', ''] },
      lofi: { fn: 45, file: ['Airani Iofifteen', 'weights/hololive-id/Iofi/Iofi_KitLemonfoot.pth', 'weights/hololive-id/Iofi/added_IVF256_Flat_nprobe_1_AiraniIofifteen_Speaking_V2_v2.index', ''] },
      risu: { fn: 46, file: ['Ayunda Risu', 'weights/hololive-id/Risu/Risu_Megaaziib.pth', 'weights/hololive-id/Risu/added_IVF2090_Flat_nprobe_1_v2_mbkm.index', ''] },
      ollie: { fn: 47, file: ['Kureiji Ollie', 'weights/hololive-id/Ollie/Ollie_Dacoolkid.pth', 'weights/hololive-id/Ollie/added_IVF2227_Flat_nprobe_1_ollie_v2_mbkm.index', ''] },
      anya: { fn: 48, file: ['Anya Melfissa', 'weights/hololive-id/Anya/Anya_Megaaziib.pth', 'weights/hololive-id/Anya/added_IVF910_Flat_nprobe_1_anyav2_v2_mbkm.index', ''] },
      reine: { fn: 49, file: ['Pavolia Reine', 'weights/hololive-id/Reine/Reine_KitLemonfoot.pth', 'weights/hololive-id/Reine/added_IVF256_Flat_nprobe_1_PavoliaReine_Speaking_KitLemonfoot_v2.index', ''] },
      zeta: { fn: 50, file: ['Vestia Zeta', 'weights/hololive-id/Zeta/Zeta_Megaaziib.pth', 'weights/hololive-id/Zeta/added_IVF462_Flat_nprobe_1_zetav2_v2.index', ''] },
      kaela: { fn: 51, file: ['Kaela Kovalskia', 'weights/hololive-id/Kaela/Kaela_Megaaziib.pth', 'weights/hololive-id/Kaela/added_IVF265_Flat_nprobe_1_kaelaV2_v2.index', ''] },
      kobo: { fn: 52, file: ['Kobo Kanaeru', 'weights/hololive-id/Kobo/Kobo_Megaaziib.pth', 'weights/hololive-id/Kobo/added_IVF454_Flat_nprobe_1_kobov2_v2.index', ''] }
    }
  }

  generateSession() {
    return Math.random().toString(36).slice(2)
  }

  async upload(buffer) {
    const upload_id = this.generateSession()
    const orig_name = `audio_${Date.now()}.mp3`
    const form = new FormData()
    form.append('files', buffer, orig_name)

    const res = await axios.post(`${this.api_url}/upload?upload_id=${upload_id}`, form, {
      headers: { ...form.getHeaders() }
    })

    return {
      orig_name,
      path: res.data[0],
      url: `${this.file_url}${res.data[0]}`
    }
  }

  async process(buffer, options = {}) {
    const { model = 'moona', transpose = 0 } = options
    if (!Buffer.isBuffer(buffer)) throw new Error('Audio tidak valid')
    if (!this.models[model]) throw new Error(`Model tidak ditemukan`)

    const audio = await this.upload(buffer)
    const session_hash = this.generateSession()

    await axios.post(`${this.api_url}/queue/join`, {
      data: [
        ...this.models[model].file,
        {
          path: audio.path,
          url: audio.url,
          orig_name: audio.orig_name,
          size: buffer.length,
          mime_type: 'audio/mpeg',
          meta: { _type: 'gradio.FileData' }
        },
        '',
        'English-Ana (Female)',
        transpose,
        'pm',
        0.4,
        1,
        0,
        1,
        0.23
      ],
      event_data: null,
      fn_index: this.models[model].fn,
      trigger_id: 620,
      session_hash
    })

    const { data } = await axios.get(`${this.api_url}/queue/data?session_hash=${session_hash}`)

    for (const line of data.split('\n\n')) {
      if (line.startsWith('data:')) {
        const d = JSON.parse(line.slice(6))
        if (d.msg === 'process_completed') {
          return d.output.data[1].url
        }
      }
    }

    throw new Error('Gagal memproses audio')
  }

  listModels() {
    return Object.entries(this.models)
      .map(([key, val]) => `• *${key}* — ${val.file[0]}`).join('\n')
  }
}

const rvc = new RVCHoloID()

let handler = async (m, { conn, args }) => {
  const model = (args[0] || '').toLowerCase()
  const transpose = parseInt(args[1] || '0')

  if (args[0] === 'list') {
    return await conn.sendMessage(m.chat, {
      text: `📢 *Daftar Model Voice Changer:*\n\n${rvc.listModels()}\n\nGunakan:\n.holovoice <model> <transpose>\n\nTranspose:\n12 = Cowok ke Cewek\n-12 = Cewek ke Cowok\n0 = Tanpa perubahan`,
    }, { quoted: m })
  }

  const isAudio = m.quoted?.audio || m.quoted?.ptt
  if (!isAudio) {
    return await conn.sendMessage(m.chat, {
      text: `❗ Balas audio/mp3/vn dengan perintah:\n.holovoice <model> <transpose>\n\nContoh:\n.holovoice moona 12\n.holovoice kobo -12\n\nLihat semua model: *.holovoice list*`,
    }, { quoted: m })
  }

  if (!rvc.models[model]) {
    return await conn.sendMessage(m.chat, {
      text: `❌ Model *${model}* tidak ditemukan.\n\nKetik *.holovoice list* untuk melihat semua model.`,
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { react: { text: '🎙️', key: m.key } })

  try {
    const buffer = await m.quoted.download()
    const url = await rvc.process(buffer, { model, transpose })
    const audio = await axios.get(url, { responseType: 'arraybuffer' })

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audio.data),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `❌ Gagal mengubah suara: ${e.message}`,
    }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
  }
}

handler.command = ['holovoice']
handler.tags = ['tools','ai']
handler.help = ['holovoice <model> <transpose>', 'holovoice list']

export default handler