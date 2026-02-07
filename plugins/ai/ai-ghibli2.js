import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// [MODIFIKASI] Menambahkan fkontak
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `AI Ghibli Style 🖼` }
};

const ghibli = {
  api: {
    base: 'https://api.code12.cloud',
    endpoints: {
      paygate: (slug) => `/app/paygate-oauth${slug}`,
      ghibli: (slug) => `/app/v2/ghibli/user-image${slug}`,
    },
  },

  creds: {
    appId: 'DKTECH_GHIBLI_Dktechinc',
    secretKey: 'r0R5EKF4seRwqUIB8gLPdFvNmPm8rN63',
  },

  studios: [
    'ghibli-howl-moving-castle-anime',
    'ghibli-spirited-away-anime',
    'ghibli-my-neighbor-totoro-anime',
    'ghibli-ponyo-anime',
    'ghibli-grave-of-fireflies-anime',
    'ghibli-princess-mononoke-anime',
    'ghibli-kaguya-anime',
  ],

  headers: {
    'user-agent': 'NB Android/1.0.0',
    'accept-encoding': 'gzip',
  },

  db: './db.json',

  log: (...args) => console.log(...args),

  readDB: () => {
    try {
      return null;
    } catch {
      return null;
    }
  },

  writeDB: (data) => {},

  getStudioId: (id) => {
    if (typeof id === 'number' && ghibli.studios[id]) return ghibli.studios[id];
    if (typeof id === 'string' && ghibli.studios.includes(id)) return id;
    return null;
  },

  getNewToken: async () => {
    try {
      const url = `${ghibli.api.base}${ghibli.api.endpoints.paygate('/token')}`;

      const res = await axios.post(
        url,
        { 
            appId: ghibli.creds.appId, 
            secretKey: ghibli.creds.secretKey 
          },
       {
          headers: { 
            ...ghibli.headers, 
            'content-type': 'application/json'
        },
          validateStatus: () => true,
        }
      );

      if (res.status !== 200 || res.data?.status?.code !== '200') {
        return {
          success: false,
          code: res.status || 500,
          result: { 
            error: res.data?.status?.message || '❌ Gagal mengambil token' 
          },
        };
      }

      const { token, tokenExpire, encryptionKey } = res.data.data;

      return { 
        success: true, 
        code: 200, 
        result: { 
            token, 
            tokenExpire, 
            encryptionKey
       }
     };
    } catch (err) {
      return { success: false, code: err?.response?.status || 500, result: { error: err.message } };
    }
  },

  getToken: async () => {
    return await ghibli.getNewToken();
  },

  generate: async ({ studio, filePath }) => {
    const studioId = ghibli.getStudioId(studio);
    if (!studioId) {
      return {
        success: false,
        code: 400,
        result: {
          error: `Studionya harus pakai index (0-${ghibli.studios.length - 1})!\n• Daftar: ${ghibli.studios.map((id, i) => `[${i}] ${id}`).join(', ')}`,
        },
      };
    }

    if (!filePath || filePath.trim() === '' || !fs.existsSync(filePath)) {
      return {
        success: false,
        code: 400,
        result: { 
            error: 'Image tidak boleh kosong!'
         },
      };
    }

    try {
      const toket = await ghibli.getToken();
      if (!toket.success) return toket;

      const { token } = toket.result;

      const form = new FormData();
      form.append('studio', studioId);
      form.append('file', fs.createReadStream(filePath), {
        filename: filePath.split('/').pop(),
        contentType: 'image/jpeg',
      });

      const url = `${ghibli.api.base}${ghibli.api.endpoints.ghibli('/edit-theme')}?uuid=1212`;

      const res = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(),
          ...ghibli.headers,
          authorization: `Bearer ${token}`,
        },
        validateStatus: () => true,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (res.status !== 200 || res.data?.status?.code !== '200') {
        return {
          success: false,
          code: res.status || 500,
          result: { 
            error: res.data?.status?.message || res.data?.message || `${res.status}`
          },
        };
      }

      const { imageId, imageUrl, imageOriginalLink } = res.data.data;
      return { 
        success: true, 
        code: 200, 
        result: { 
            imageId, 
            imageUrl, 
            imageOriginalLink
        }
      };
    } catch (err) {
      return { 
        success: false, 
        code: err?.response?.status || 500, 
        result: { 
            error: err.message
        }
     };
    }
  },
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    
    // [MODIFIKASI] Menggunakan fkontak
    if (!mime.startsWith('image/')) return conn.reply(m.chat, `Kirim atau reply gambar dengan caption\n ${usedPrefix + command} <studio_id>\n\nStudio ID:\n0 : Howl Moving Castle\n1 : Spirited Away\n2 : My Neighbor Totoro\n3 : Ponyo\n4 : Grave of Fireflies\n5 : Princess Mononoke\n6 : Kaguya`, m, { quoted: fkontak });
    
    // [MODIFIKASI] Menggunakan fkontak
    if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) < 0 || parseInt(args[0]) > 6) {
      return conn.reply(m.chat, 'Studio ID harus 0-6\n\n0 : Howl Moving Castle\n1 : Spirited Away\n2 : My Neighbor Totoro\n3 : Ponyo\n4 : Grave of Fireflies\n5 : Princess Mononoke\n6 : Kaguya', m, { quoted: fkontak });
    }
    
    // [MODIFIKASI] Menggunakan fkontak untuk pesan tunggu
    await conn.sendMessage(m.chat, { text: '⏳ Processing image to Ghibli Style...' }, { quoted: fkontak });
    
    const tempPath = `./temp_${Date.now()}.jpg`
    fs.writeFileSync(tempPath, await q.download())
    
    const { result } = await ghibli.generate({
      studio: parseInt(args[0]),
      filePath: tempPath
    })
    
    fs.unlinkSync(tempPath)
    
    // [MODIFIKASI] Menggunakan fkontak saat mengirim hasil gambar
    await conn.sendMessage(m.chat, { image: { url: result.imageUrl } }, { quoted: fkontak });
    
  } catch (e) {
    // [MODIFIKASI] Menggunakan fkontak untuk pesan error
    conn.reply(m.chat, e.message, m, { quoted: fkontak });
  }
}

handler.help = ['toghibli2', 'ghibli2', 'ghiblikan2'];
handler.command = /^((toghibli|ghibli|ghiblikan)2?)$/i;
handler.tags = ['ai'];

export default handler;