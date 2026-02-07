let handler = async (m, { conn }) => {
    let who;
    if (m.isGroup && m.mentionedJid && m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        return m.reply('Tag atau reply orangnya!');
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL', '11XL', '12XL', '13XL', '14XL', '15XL', '16XL'];
    const colors = ['Merah', 'Biru', 'Hijau', 'Kuning', 'Hitam', 'Putih', 'Oranye', 'Ungu', 'Coklat', 'Abu-abu', 'Merah Muda', 'Biru Muda', 'Hijau Muda', 'Krem', 'Biru Tua', 'Hijau Tua', 'Biru Langit', 'Toska', 'Salmon', 'Emas', 'Perak', 'Magenta', 'Cyan', 'Olive', 'Navy'];
    const shapes = ['Boxer', 'Brief', 'Trunk', 'Thong', 'Jockstrap', 'Bikini', 'Hipster', 'Boyshort', 'Tanga', 'G-string', 'T-brief', 'Mini Boxer', 'Shorty', 'Midi', 'Maxi', 'Slip', 'High-leg', 'Cheeky', 'Brazilian', 'Cutaway', 'Sport Brief'];

    const randomSize = getRandomItem(sizes);
    const randomColor = getRandomItem(colors);
    const randomShape = getRandomItem(shapes);

    conn.reply(m.chat, `Sempak si @${who.split('@')[0]} adalah:\nUkuran: ${randomSize}\nWarna: ${randomColor}\nBentuk: ${randomShape}`, m, { contextInfo: { mentionedJid: [who] } });
}

handler.help = handler.command = ["ceksempak"];
handler.tags = ["group"];

export default handler;

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}