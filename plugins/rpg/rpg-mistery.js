const armorNames = {
    6: "Dragonplate",
    7: "Celestial",
    8: "Stormbringer"
};

const swordNames = {
    6: "Shadowbane",
    7: "Stormbringer",
    8: "Excalibur"
};

const armorPAyakas = {
    6: 25000000,
    7: 30000000,
    8: 35000000
};

const swordPAyakas = {
    6: 30000000,
    7: 35000000,
    8: 40000000
};

const DURABILITY_VALUE = 150; // Nilai durability yang akan ditambahkan

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const now = new Date();
    const hour = now.getUTCHours(); // Menggunakan getUTCHours() untuk waktu UTC
    const day = now.getUTCDay(); // Menggunakan getUTCDay() untuk mendapatkan hari dalam UTC (0: Minggu, 1: Senin, dst.)

    // Toko Misteri dapat diakses dari pukul 00:00 sampai 20:00 (WIB) pada hari Jumat, Minggu, dan Selasa
    const isWithinTime = (day === 2 || day === 5 || day === 0) && hour >= 0 && hour < 20; // 2: Selasa, 5: Jumat, 0: Minggu

    if (!isWithinTime) {
        return conn.reply(m.chat, `⏰ Toko Misteri hanya dapat diakses dari pukul 00:00 sampai 20:00 WIB pada hari Jumat, Minggu, dan Selasa.`, m);
    }

    const mysteryShopList = `
🎁 *Mystery Shop* 🎁
Gunakan perintah: \`${usedPrefix}mysteryshop <armor|sword>\` atau \`${usedPrefix}misterishop <armor|sword>\`

📌 *Contoh penggunaan:* \`${usedPrefix}mysteryshop armor\` atau \`${usedPrefix}misterishop armor\`

============================

🛡️ *Armor yang Tersedia:*
1. ${armorNames[6]} - Rp${armorPAyakas[6].toLocaleString()}
2. ${armorNames[7]} - Rp${armorPAyakas[7].toLocaleString()}
3. ${armorNames[8]} - Rp${armorPAyakas[8].toLocaleString()}

============================

⚔️ *Pedang yang Tersedia:*
1. ${swordNames[6]} - Rp${swordPAyakas[6].toLocaleString()}
2. ${swordNames[7]} - Rp${swordPAyakas[7].toLocaleString()}
3. ${swordNames[8]} - Rp${swordPAyakas[8].toLocaleString()}
`.trim();

    try {
        if (/mysteryshop|misterishop/i.test(command)) {
            let itemType = args[0]?.toLowerCase();
            if (!itemType || (itemType !== 'armor' && itemType !== 'sword')) {
                return conn.reply(m.chat, mysteryShopList, m);
            }

            if (itemType === 'armor') {
                let currentArmorLevel = global.db.data.users[m.sender].armor || 0;
                let nextArmorLevel = currentArmorLevel + 1; // Level berikutnya

                if (currentArmorLevel >= 8) {
                    return conn.reply(m.chat, `⚠️ Anda sudah memiliki ${armorNames[8]}. Tidak bisa membeli armor lagi.`, m);
                }

                if (nextArmorLevel > 8) {
                    return conn.reply(m.chat, `⚠️ Tidak ada armor dengan level lebih tinggi dari ${armorNames[8]}`, m);
                }

                let buyingPAyaka = armorPAyakas[nextArmorLevel];
                if (global.db.data.users[m.sender].money < buyingPAyaka)
                    return conn.reply(m.chat, `❌ Uang anda tidak cukup untuk membeli ${armorNames[nextArmorLevel]} dengan harga Rp${buyingPAyaka.toLocaleString()}`, m);

                global.db.data.users[m.sender].armor = nextArmorLevel;
                global.db.data.users[m.sender].armorDurability = DURABILITY_VALUE;
                global.db.data.users[m.sender].money -= buyingPAyaka;
                conn.reply(m.chat, `✅ Sukses membeli ${armorNames[nextArmorLevel]} dengan harga Rp${buyingPAyaka.toLocaleString()}.\n🛡️ Durability: ${DURABILITY_VALUE}`, m);
            } else if (itemType === 'sword') {
                let currentSwordLevel = global.db.data.users[m.sender].sword || 0;
                let nextSwordLevel = currentSwordLevel + 1; // Level berikutnya

                if (currentSwordLevel >= 8) {
                    return conn.reply(m.chat, `⚠️ Anda sudah memiliki ${swordNames[8]}. Tidak bisa membeli pedang lagi.`, m);
                }

                if (nextSwordLevel > 8) {
                    return conn.reply(m.chat, `⚠️ Tidak ada pedang dengan level lebih tinggi dari ${swordNames[8]}`, m);
                }

                let buyingPAyaka = swordPAyakas[nextSwordLevel];
                if (global.db.data.users[m.sender].money < buyingPAyaka)
                    return conn.reply(m.chat, `❌ Uang anda tidak cukup untuk membeli ${swordNames[nextSwordLevel]} dengan harga Rp${buyingPAyaka.toLocaleString()}`, m);

                global.db.data.users[m.sender].sword = nextSwordLevel;
                global.db.data.users[m.sender].swordDurability = DURABILITY_VALUE;
                global.db.data.users[m.sender].money -= buyingPAyaka;
                conn.reply(m.chat, `✅ Sukses membeli ${swordNames[nextSwordLevel]} dengan harga Rp${buyingPAyaka.toLocaleString()}.\n⚔️ Durability: ${DURABILITY_VALUE}`, m);
            } else {
                conn.reply(m.chat, mysteryShopList, m);
            }
        }
    } catch (e) {
        conn.reply(m.chat, mysteryShopList, m);
        console.error(e);
    }
};

handler.help = ['mysteryshop'];
handler.tags = ['rpg'];
handler.command = /^(mysteryshop|misterishop)$/i;
handler.limit = true;
handler.group = true;

export default handler;