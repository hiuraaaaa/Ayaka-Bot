import fs from 'fs';
import path from 'path';

const redeemFile = path.join(process.cwd(), 'src', 'coderedeem.json');

const loadRedeemData = () => {
    try {
        if (!fs.existsSync(redeemFile)) {
            const dir = path.dirname(redeemFile);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(redeemFile, JSON.stringify({}, null, 2));
            return {};
        }
        const data = fs.readFileSync(redeemFile, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error loading redeem data:', e);
        return {};
    }
};

const saveRedeemData = (data) => {
    try {
        fs.writeFileSync(redeemFile, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error saving redeem data:', e);
    }
};

const isExpired = (expiresAt) => new Date(expiresAt) < new Date();

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    let redeemCodes = loadRedeemData();
    let args = text.trim().split(' ');
    let subCommand = args[0] ? args[0].toLowerCase() : '';
    const generateId = () => Math.random().toString(36).substr(2, 8).toUpperCase();

    if (!subCommand) {
        let availableCommands = isOwner
            ? `Halo, Sensei! Ini command yang bisa kamu pake:\n- ${usedPrefix}${command} claim <id code>\n- ${usedPrefix}${command} create <limit> <item> <jumlah>\n- ${usedPrefix}${command} delete <id>\n- ${usedPrefix}${command} list`
            : `Halo, Sensei! Kamu cuma bisa pake:\n- ${usedPrefix}${command} claim <id code>`;
        return m.reply(`${availableCommands}\n\nPilih yang bener ya, Sensei, aku tunggu sambil nyanyi buat hibur kamu 🎤`);
    }

    if (!isOwner && subCommand !== 'claim') {
        return m.reply(`Eh, Sensei! Kamu bukan owner, jadi cuma bisa pake "${usedPrefix}${command} claim <id code>" aja. Sabar ya, aku kasih coklat biar gak sedih 🍫`);
    }

    switch (subCommand) {
        case 'claim': {
            let codeId = args[1]?.toUpperCase();
            if (!codeId) return m.reply(`Masukin ID codenya, Sensei! Contoh: ${usedPrefix}${command} claim ABC123`);
            let codeData = redeemCodes[codeId];
            if (!codeData) return m.reply(`Kode ${codeId} gak ada, Sensei! Apa salah ketik? Aku bantu cari kodenya kalo hilang 😆`);
            if (isExpired(codeData.expiresAt)) {
                delete redeemCodes[codeId];
                saveRedeemData(redeemCodes);
                return m.reply(`Kode ${codeId} udah kadaluarsa, Sensei! Sayur apa yang susah dilupain? Bayam-bayam dirimu~ 😂`);
            }
            if (codeData.limit <= 0) return m.reply(`Kode ${codeId} udah habis limitnya, Senpai! Telat nih, cepetan lain kali ya~`);
            let user = db.data.users[m.sender];
            if (!user) db.data.users[m.sender] = { claimedCodes: [] };
            if (user.claimedCodes && user.claimedCodes.includes(codeId)) {
                return m.reply(`Sensei udah claim kode ${codeId} sebelumnya! Gak boleh doble claim ya, aku jadi cemburu 😝`);
            }
            if (!user[codeData.item]) user[codeData.item] = 0;
            user[codeData.item] += codeData.jumlah;
            codeData.limit -= 1;
            if (!user.claimedCodes) user.claimedCodes = [];
            user.claimedCodes.push(codeId);
            if (codeData.limit === 0) delete redeemCodes[codeId];
            saveRedeemData(redeemCodes);
            m.reply(`Sukses claim kode ${codeId}, Sensei!\nKamu dapet: ${codeData.jumlah} ${codeData.item}\nKeren banget, Sensei!`);
            break;
        }
        case 'create': {
            let limit = parseInt(args[1]);
            let item = args[2];
            let jumlah = parseInt(args[3]);
            if (isNaN(limit) || !item || isNaN(jumlah)) {
                return m.reply(`Format salah, Sensei! Contoh: ${usedPrefix}${command} create 5 exp 100\nLimit, item, sama jumlahnya harus jelas ya!`);
            }
            if (limit <= 0 || jumlah <= 0) {
                return m.reply(`Limit atau jumlah gak boleh 0 atau minus, Sensei! Kode redeem kok gitu, aku takut jadi zombie 👻`);
            }
            let codeId = generateId();
            let createdAt = new Date();
            let expiresAt = new Date(createdAt);
            expiresAt.setDate(createdAt.getDate() + 30);
            redeemCodes[codeId] = {
                limit: limit,
                item: item.toLowerCase(),
                jumlah: jumlah,
                createdAt: createdAt.toLocaleString('id-ID'),
                expiresAt: expiresAt.toISOString()
            };
            saveRedeemData(redeemCodes);
            m.reply(`Kode redeem berhasil dibuat, Sensei!\n*ID:* ${codeId}\n*Limit:* ${limit}\n*Item:* ${jumlah} ${item}\n*Kadaluarsa:* ${expiresAt.toLocaleString('id-ID')}\nBagiin ke temenmu sebelum expired ya!`);
            break;
        }
        case 'delete': {
            let codeId = args[1]?.toUpperCase();
            if (!codeId) return m.reply(`Masukin ID codenya, Sensei! Contoh: ${usedPrefix}${command} delete ABC123`);
            if (!redeemCodes[codeId]) {
                return m.reply(`Kode ${codeId} gak ada, Sensei! Apa udah kehapus atau expired? Aku bantu cek kalo bingung 😂`);
            }
            delete redeemCodes[codeId];
            saveRedeemData(redeemCodes);
            m.reply(`Kode ${codeId} berhasil dihapus, Sensei! Bersih-bersih selesai, mau aku bantu apa lagi?`);
            break;
        }
        case 'list': {
            if (Object.keys(redeemCodes).length === 0) {
                return m.reply(`Belum ada kode redeem, Sensei! Ayo bikin satu, aku bantu kasih ide kalo bingung~`);
            }
            let list = `Daftar Kode Redeem, Sensei!\n\n`;
            for (let id in redeemCodes) {
                let { limit, item, jumlah, createdAt, expiresAt } = redeemCodes[id];
                let expired = isExpired(expiresAt);
                if (expired) {
                    delete redeemCodes[id];
                    continue;
                }
                list += `*ID:* ${id}\n*Limit:* ${limit}\n*Item:* ${jumlah} ${item}\n*Dibuat:* ${createdAt}\n*Kadaluarsa:* ${new Date(expiresAt).toLocaleString('id-ID')}\n\n`;
            }
            saveRedeemData(redeemCodes);
            m.reply(list + `Keren, kan? Cek kadaluarsa ya, jangan sampe kelewat, Sensei!`);
            break;
        }
        default:
            m.reply(`Command ${subCommand} gak ada, Sensei! Coba cek lagi ya, aku bantu sambil joget biar gak bosen 🕺`);
    }
};

handler.help = ['coderedeem'];
handler.tags = ['main'];
handler.command = /^(coderedem|coderedeem)$/i;
handler.register = true;

export default handler;