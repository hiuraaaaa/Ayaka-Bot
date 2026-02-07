/**
@credit RijalGanzz
@Furina Md
@Whatsapp Me
wa.me/62882009507703
**/
const furina = async (m, { conn, args }) => {
  try {
    let text = args.join(' ');
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
    if (!text) {
      return m.reply("MASUKAN TEXT 🤓");
    }

    await conn.sendMessage(m.chat, { react: { text: `🕒`, key: m.key } });

    const ELEVENLABS_API_KEY = "sk_a3f0c9ef30420783bd34524e5a9cb063b939bef9caa0e868"; 
    const voiceId = "RWiGLY9uXI70QL540WNd"; 
    const modelId = "eleven_multilingual_v2"; 

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
      });

      if (!response.ok) {
        let errorMessage = `Eleven Labs API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.detail || 'Unknown error'}`;
        } catch (jsonError) {
          errorMessage += ` (Could not parse error response)`;
        }
        throw new Error(errorMessage);
      }

      const audioBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(audioBuffer);

      await conn.sendFile(m.chat, buffer, 'tts.mp3', null, m, true);
      await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });

    } catch (e) {
      await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } });
      m.reply(`Maaf, terjadi kesalahan saat menghasilkan suara: ${e.message}.`);
      console.error("Eleven Labs Error:", e);
    }
  } catch (error) {
    console.error("furina Error:", error);
    m.reply("Terjadi kesalahan pada furina. Mohon coba lagi.");
  }
};

furina.help = ['drbrando <teks>'];
furina.tags = ['ai'];
furina.command = /^drbrando$/i;
furina.limit = 20;
furina.premium = false;

export default furina;