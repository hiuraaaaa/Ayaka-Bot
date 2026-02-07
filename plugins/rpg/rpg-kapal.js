import fs from 'fs';
const { generateWAMessageFromContent, proto } = (await import("@adiwajshing/baileys")).default;

let cooldowns = {};
const COOLDOWN_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

let handler = async (m, { conn, args, command }) => {
    let name = conn.getName(m.sender);
    let mentionedJid = [m.sender];

    // Get the current time
    let currentTime = Date.now();
    
    // Initialize the cooldown for the user if it doesn't exist
    if (!cooldowns[m.sender]) {
        cooldowns[m.sender] = 0;
    }

    // Check if the user is still on cooldown for the journey
    if (currentTime < cooldowns[m.sender]) {
        let remainingTime = Math.ceil((cooldowns[m.sender] - currentTime) / 1000 / 60);
        return conn.sendMessage(m.chat, { text: `⏳ Harap tunggu ${remainingTime} menit lagi sebelum berlayar lagi.` }, { quoted: m });
    }

    const countries = ["Amerika", "Belanda", "China", "Inggris", "India", "Indonesia", "Italia", "Jepang", "Korea", "Malaysia", "Rusia", "Singapura", "Spanyol", "Thailand", "Jerman"];

    switch (command) {
        case 'kapal':
            // Display the available countries
            let countryList = countries.map((country, index) => `${index + 1}. ${country}`).join('\n');
            await conn.sendMessage(m.chat, { text: `🚢 Berlayar menuju berbagai dunia. Berikut adalah negara yang dapat dikunjungi:\n\n${countryList}\nContoh: .berlayar 10` }, { quoted: flok });
            break;

        case 'berlayar':
            let choice = parseInt(args[0]) - 1;

            if (isNaN(choice) || choice < 0 || choice >= countries.length) {
                return conn.sendMessage(m.chat, { text: "Pilihan tidak valid. Silakan pilih negara dengan mengetik berlayar <nomor>." }, { quoted: m });
            }

            let selectedCountry = countries[choice];

            // Notify the user they are departing
            const sentMessage = await conn.sendMessage(m.chat, { text: `🛳️ Kamu berangkat menuju\n🗺 ${selectedCountry}.` }, { quoted: m });

            // Simulate journey time and rewards
            let money = Math.floor(Math.random() * (3000000 - 100 + 1)) + 100;
            let exp = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
            let legendary = Math.floor(Math.random() * (30 - 12 + 1)) + 12;

            // Set a temporary cooldown for this journey
            cooldowns[m.sender] = currentTime + COOLDOWN_TIME; // Set cooldown for 1 hour

            // Wait for a short duration to simulate the journey
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Send the reward message after the journey
            let message = `🚢 Perjalanan menuju ${selectedCountry} berhasil 🌎\n\nKamu mendapatkan:\n💰 Money: ${money}\n🧪 Exp: ${exp}\n🏆 Legendary: ${legendary}`;

            await conn.sendMessage(m.chat, { text: message, edit: sentMessage.key }, { quoted: m });

            // Update global database
            if (!global.db.data.users[m.sender]) {
                global.db.data.users[m.sender] = { money: 0, exp: 0, legendary: 0 };
            }

            global.db.data.users[m.sender].money += money;
            global.db.data.users[m.sender].exp += exp;
            global.db.data.users[m.sender].legendary += legendary;
            break;
    }

    // Optional: Message to encourage users to sail again
    setTimeout(() => {
        conn.reply(m.chat, `Ayo Berlayar lagi ke negara-negara besar!`, m);
    }, 3600000); // 1 hour
};

handler.help = ['kapal'];
handler.tags = ['rpg'];
handler.command = /^(kapal|berlayar)$/i;
handler.group = true;
handler.limit = true;
handler.register = true;

export default handler;