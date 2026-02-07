import axios from 'axios';
import { PassThrough } from 'stream';

async function convertAiToHumanStream(discussiontopic, options = {}) {
  const params = {
    wpaicg_stream: 'yes',
    discussiontopic: encodeURIComponent(discussiontopic),
    engine: options.engine || 'gpt-4o-mini',
    max_tokens: options.max_tokens || 2600,
    temperature: options.temperature || 0.8,
    top_p: options.top_p || 1,
    best_of: options.best_of || 1,
    frequency_penalty: options.frequency_penalty || 0,
    presence_penalty: options.presence_penalty || 0,
    stop: options.stop || '',
    post_title: options.post_title || 'AI to Human Text Converter (Normal)',
    id: options.id || '1654',
    source_stream: options.source_stream || 'form',
    nonce: options.nonce || 'f03c73b6b9'
  };

  const headers = {
    'authority': 'aitohuman.org',
    'accept': 'text/event-stream',
    'referer': 'https://aitohuman.org/ai-to-human-text-converter-ai/',
    'user-agent': 'Mozilla/5.0 (Android)',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
  };

  try {
    const response = await axios({
      method: 'get',
      url: 'https://aitohuman.org/index.php',
      params: params,
      headers: headers,
      responseType: 'stream'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Gagal request: ${error.message}`);
  }
}

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`Kirim teks AI-nya kayak gini:\n${usedPrefix}${command} Ini teks hasil AI yang mau diubah.`);

  m.reply('_Tunggu sebentar ya Senpai, lagi disulap jadi tulisan manusia..._');

  try {
    const stream = await convertAiToHumanStream(text, {
      temperature: 0.7,
      max_tokens: 1000
    });

    let fullResponse = '';
    const passthrough = new PassThrough();

    stream.pipe(passthrough);

    passthrough.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6).trim();
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0].delta?.content) {
              fullResponse += parsed.choices[0].delta.content;
            }
          } catch {}
        }
      }
    });

    passthrough.on('end', async () => {
      if (!fullResponse.trim()) throw 'Gagal dapetin respon.';

      await m.reply(`*Hasil AI to Human:*\n\n${fullResponse}`);
    });

    passthrough.on('error', (err) => {
      console.error('Stream error:', err);
      m.reply('Terjadi error saat proses streaming.');
    });

  } catch (e) {
    console.error(e);
    m.reply(`Gagal konversi: ${e.message}`);
  }
};

handler.help = ['aitohuman'];
handler.tags = ['ai'];
handler.command = /^(aitohuman|aihuman)$/i;
handler.register = true;
handler.limit = 1;

export default handler;