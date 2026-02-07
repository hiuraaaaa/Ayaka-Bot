const handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args.length) {
        return conn.reply(m.chat, `✨ *Example Usage:* \n🔍 ${usedPrefix}${command} fitur`, m);
    }

    let plugins = Object.entries(global.plugins).filter(([name, v]) => v.help && Array.isArray(v.tags));
    let query = args.join(' ').toLowerCase();
    let filteredPlugins = plugins.filter(([name, v]) => Array.isArray(v.help) && v.help.some(h => h.toLowerCase().includes(query)));

    if (filteredPlugins.length === 0) {
        return conn.reply(m.chat, `❌ *Tidak ada fitur yang cocok dengan pencarian:* \n🔍 '${query}'`, m);
    }

    let message = `🔎 *Hasil Pencarian untuk:* '${query}' \n\n`;
    message += filteredPlugins.map(([name, v]) => `✅ *${Array.isArray(v.help) ? v.help.join(', ') : v.help}*\n📌 *Tags:* ${Array.isArray(v.tags) ? v.tags.join(', ') : 'Tidak ada'}\n📂 *Plugin:* ${name}\n`).join('\n');
    conn.reply(m.chat, message, m);
}

handler.help = ['searchfitur'];
handler.tags = ['tools', 'owner'];
handler.command = ['searchfitur'];
handler.owner = true;

export default handler;