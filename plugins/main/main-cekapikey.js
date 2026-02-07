import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  try {
    await m.reply(wait);
    let api = await fetch(`${global.APIs.botcahx}/api/checkkey?apikey=ubed2407`);
    let body = await api.json();
    let { 
      email, 
      username, 
      limit, 
      premium, 
      expired, 
      todayHit,
      totalHit
    } = body.result;
    
    let capt = `${global.titlebot} *C H E C K   A P I K E Y*\n\n`;
    capt += `◦ *Email*: ${email}\n`;
    capt += `◦ *Username*: ${username}\n`;
    capt += `◦ *Limit*: ${limit}\n`;
    capt += `◦ *Premium*: ${premium}\n`;
    capt += `◦ *Expired*: ${expired}\n`;
    capt += `◦ *Today Hit*: ${todayHit}\n`;
    capt += `◦ *Total Hit*: ${totalHit}\n\n`;
    await conn.reply(m.chat, capt, m);
  } catch (e) {
    console.error(e);
    throw new Error('Terjadi kesalahan saat memeriksa API Key');
  }
};

handler.command = handler.help = ['checkapi', 'api'];
handler.tags = ['main'];
handler.owner = true;

export default handler;