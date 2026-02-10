const {
    proto,
    generateWAMessage,
    areJidsSameUser
} = (await import('@adiwajshing/baileys')).default

export async function all(m, chatUpdate) {
    // ==========================================
    // FILTER NEWSLETTER - CRITICAL FIX
    // ==========================================
    
    // Skip jika Baileys message
    if (m.isBaileys) return
    
    // Skip jika tidak ada message
    if (!m.message) return
    
    // Skip jika dari newsletter
    if (m.chat?.endsWith('@newsletter')) {
        console.log('📰 Newsletter message skipped in _cmdWithMedia');
        return;
    }
    
    // Safe check: Skip jika sender dari newsletter
    if (m.sender?.endsWith('@newsletter')) {
        console.log('📰 Newsletter sender skipped in _cmdWithMedia');
        return;
    }
    
    // Safe check: Pastikan m.msg ada sebelum akses properti
    if (!m.msg) return;
    
    // Safe check: Pastikan fileSha256 ada
    if (!m.msg.fileSha256) return;
    
    // ==========================================
    // MAIN LOGIC
    // ==========================================
    
    // Convert fileSha256 to base64
    const fileHash = Buffer.from(m.msg.fileSha256).toString('base64');
    
    // Check if hash exists in database
    if (!(fileHash in global.db.data.sticker)) return;

    let hash = global.db.data.sticker[fileHash];
    let { text, mentionedJid } = hash;
    
    // Generate WA message
    let messages = await generateWAMessage(m.chat, { 
        text: text, 
        mentions: mentionedJid 
    }, {
        userJid: this.user.id,
        quoted: m.quoted && m.quoted.fakeObj
    });
    
    messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    
    if (m.isGroup) messages.participant = m.sender;
    
    let msg = {
        ...chatUpdate,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: 'append'
    };
    
    this.ev.emit('messages.upsert', msg);
}
