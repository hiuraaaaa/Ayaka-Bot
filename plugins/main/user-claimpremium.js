let handler = async (m, { conn }) => {
    let user = db.data.users[m.sender];
    let now = new Date() * 1;
    const durasiHari = 5; 
    const cooldownHari = 30; 
    const durasi = 86400000 * durasiHari;
    const cooldown = 86400000 * cooldownHari;

    if (!user.lastClaimPremium) user.lastClaimPremium = 0;
    if (!user.premiumTime) user.premiumTime = 0;

    if (now - user.lastClaimPremium < cooldown) {
        let sisa = user.lastClaimPremium + cooldown - now;
        let hariSisa = Math.ceil(sisa / 86400000);
        return m.reply(`❌ Kamu sudah klaim premium bulan ini!\n\nCoba lagi dalam *${hariSisa} hari*.`);
    }

    if (now < user.premiumTime) user.premiumTime += durasi;
    else user.premiumTime = now + durasi;

    user.premium = true;
    user.lastClaimPremium = now;

    await conn.sendMessage(m.chat, {
        react: {
            text: "🏆",
            key: m.key
        }
    });

    m.reply(`
🎁 *CLAIM PREMIUM BERHASIL!*

👤 *Nama:* ${user.name}
⏰ *Durasi:* ${durasiHari} Hari
📅 *Berlaku sampai:* ${new Date(user.premiumTime).toLocaleString('id-ID')}
🔒 *Cooldown:* ${cooldownHari} Hari

Kamu bisa klaim lagi setelah 30 hari ya~
`);
};

handler.help = ['claimpremium'];
handler.tags = ['premium'];
handler.command = /^claimpremium$/i;

export default handler;