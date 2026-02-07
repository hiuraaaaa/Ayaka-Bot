import axios from 'axios';

const headers = {
  'authority': 'www.muslimai.io',
  'content-type': 'application/json',
  'user-agent': 'Postify/1.0.0'
};

const muslimai = {
  search: async function(query) {
    try {
      const cari = await axios.post('https://www.muslimai.io/api/search', { query }, { headers });
      const passages = cari.data.map(result => result.content).join("\\n\\n");

      const jawaban = await axios.post('https://www.muslimai.io/api/answer', {
        prompt: `Use the following passages to answer the query to the best of your ability as a world class expert in the Quran. Do not mention that you were provided any passages in your answer in Indonesian: ${query} \\n\\n${passages}`
      }, { headers });

      return {
        creator: 'Ponta Sensei',
        status: 'success',
        code: 200,
        data: {
          search: cari.data,
          answer: jawaban.data
        }
      };
    } catch (error) {
      return {
        creator: 'Pomta Sensei',
        status: 'error',
        code: error.response ? error.response.status : 500,
        data: {},
        message: error.message || ''
      };
    }
  }
};

let ponta = async (m, { conn, args, usedPrefix, command, text }) => {
    if (!text) throw `Silakan masukkan pertanyaan untuk mendapatkan jawaban berdasarkan Al-Qur'an.\n\nContoh: ${usedPrefix + command} Apa hukum berpuasa di bulan Ramadan?`

    await conn.sendMessage(m.chat, { react: { text: '🕌', key: m.key } });

    const result = await muslimai.search(text)

    if (result.status !== 'success') {
        return conn.reply(m.chat, `Terjadi kesalahan saat mencari jawaban:\n${result.message}`, m)
    }

    const answer = result.data.answer.trim()
    const searchResults = result.data.search.map((res, index) => `${index + 1}. ${res.content}`).join('\n\n')

    let responseMessage = `*Pertanyaan*: ${text}\n\n*Jawaban berdasarkan Al-Qur'an*:\n${answer}\n\n*Hasil Pencarian Ayat*:\n${searchResults}\n\nDibuat oleh: _Ponta Sensei_`

    conn.reply(m.chat, responseMessage, m)
}

ponta.help = ['muslimai']
ponta.tags = ['ai']
ponta.command = /^(muslimai)$/i

export default ponta