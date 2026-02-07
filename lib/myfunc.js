import axios from 'axios';

/**

 * Ambil buffer dari URL (bisa untuk gambar, audio, dsb)

 * @param {String} url

 * @param {Object} options

 * @returns {Promise<Buffer>}

 */

export async function getBuffer(url, options = {}) {

  try {

    const res = await axios.get(url, {

      headers: {

        'User-Agent': 'WhatsApp Bot',

        ...options.headers

      },

      responseType: 'arraybuffer',

      ...options

    });

    return res.data;

  } catch (err) {

    throw new Error(`Gagal ambil buffer: ${err}`);

  }

}

/**

 * Format uptime dalam bentuk hh:mm:ss

 * @param {Number} seconds

 * @returns {String}

 */

export function runtime(seconds) {

  seconds = Number(seconds);

  const h = Math.floor(seconds / 3600);

  const m = Math.floor((seconds % 3600) / 60);

  const s = Math.floor(seconds % 60);

  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');

}